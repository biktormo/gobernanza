import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';

// Componentes UI
import DimensionCard from '../components/DimensionCard';
import TopicAccordion from '../components/TopicAccordion';
import ModalPlanDeAccion from '../components/ModalPlanDeAccion';
import FilterBar from '../components/FilterBar';
import GanttChart from '../components/GanttChart';

const DIMENSION_ORDER = [
  "General",
  "Administración y Conformación del Directorio (**)",
  "Control, ética y conflicto de interés",
  "Transparencia de Stakeholders",
  "Derecho de los accionistas o socios",
  "Gobierno Familiar"
];

const PlanesDeAccion = () => {
  const [allPlanes, setAllPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const initialFilterState = location.state?.filter || {};
  const [filters, setFilters] = useState({
    searchTerm: '',
    priority: 'all',
    status: 'all',
    sortBy: 'actionIndex-asc',
    ...initialFilterState
  });
  const [selectedDimension, setSelectedDimension] = useState(null);
  const [viewMode, setViewMode] = useState('cards');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // --- NUEVO ESTADO PARA LOS DATOS DE EXPORTACIÓN ---
  const [exportData, setExportData] = useState([]);

  const planesCollectionRef = collection(db, 'planesDeAccion');

  const fetchPlanes = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(planesCollectionRef);
      const planesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      planesData.sort((a, b) => (a.actionIndex || 0) - (b.actionIndex || 0));
      setAllPlanes(planesData);
    } catch (error) {
      console.error("Error al obtener los planes de acción:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanes();
  }, []);

  const processedPlanes = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = allPlanes.filter(plan => {
      const searchTerm = filters.searchTerm?.toLowerCase() || '';
      const matchesSearch = searchTerm === '' ||
        (plan.topico && plan.topico.toLowerCase().includes(searchTerm)) ||
        (plan.accionRecomendada && plan.accionRecomendada.toLowerCase().includes(searchTerm));

      const matchesPriority = filters.priority === 'all' || !filters.priority || plan.nivelPrioridad === filters.priority;

      let matchesStatus = true;
      const fechaFin = new Date(plan.fechaFin);
      const isOverdue = !isNaN(fechaFin) && fechaFin < today && plan.estado < 100;

      switch(filters.status) {
        case 'completed': matchesStatus = plan.estado === 100; break;
        case 'inProgress': matchesStatus = plan.estado > 0 && plan.estado < 100 && !isOverdue; break;
        case 'notStarted': matchesStatus = plan.estado === 0 && !isOverdue; break;
        case 'overdue': matchesStatus = isOverdue; break;
        default: matchesStatus = true;
      }
      return matchesSearch && matchesPriority && matchesStatus;
    });

    const [sortKey, sortOrder] = filters.sortBy?.split('-') || ['actionIndex', 'asc'];
    if (sortKey !== 'actionIndex') {
      const priorityOrder = { 'Alta': 3, 'Media': 2, 'Baja': 1, 'A definir': 0 };
      filtered = [...filtered].sort((a, b) => {
        let valA, valB;
        if (sortKey === 'fechaFin') { valA = new Date(a.fechaFin); valB = new Date(b.fechaFin); } 
        else if (sortKey === 'estado') { valA = a.estado; valB = b.estado; } 
        else if (sortKey === 'prioridad') { valA = priorityOrder[a.nivelPrioridad] || 0; valB = priorityOrder[b.nivelPrioridad] || 0; } 
        else { return 0; }
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [allPlanes, filters]);

  // --- NUEVO EFECTO PARA ACTUALIZAR LOS DATOS DE EXPORTACIÓN ---
  useEffect(() => {
    if (processedPlanes && processedPlanes.length > 0) {
      // "Aplanamos" los datos y los guardamos en el estado de exportación
      const dataForCsv = processedPlanes.map(plan => ({
        // Seleccionamos y ordenamos las columnas que queremos en el CSV
        NroAccion: plan.actionIndex,
        Dimensión: plan.dimension,
        Tópico: plan.topico,
        'Acción Recomendada': plan.accionRecomendada,
        Responsables: Array.isArray(plan.responsables) ? plan.responsables.join(', ') : '',
        'Fecha Límite': plan.fechaFin,
        'Estado (%)': plan.estado,
        Prioridad: plan.nivelPrioridad,
      }));
      setExportData(dataForCsv);
    } else {
      setExportData([]);
    }
  }, [processedPlanes]);
  
  const groupedPlanes = useMemo(() => {
    return processedPlanes.reduce((acc, plan) => {
      const { dimension, topico } = plan;
      if (!acc[dimension]) acc[dimension] = {};
      if (!acc[dimension][topico]) acc[dimension][topico] = [];
      acc[dimension][topico].push(plan);
      return acc;
    }, {});
  }, [processedPlanes]);
  
  const handleFilterChange = (newFilters) => { setFilters(newFilters); setSelectedDimension(null); };
  const handleSelectDimension = (dimension) => { setSelectedDimension(dimension); setViewMode('cards'); };
  const handleBackToDimensions = () => setSelectedDimension(null);
  const handleEditPlan = (plan) => { setSelectedPlan(plan); setIsCreating(false); setIsModalOpen(true); };
  const handleCreatePlan = () => { /* ... */ };
  const handleCloseModal = () => { setIsModalOpen(false); setSelectedPlan(null); };
  const handleSavePlan = async (planData) => { /* ... */ };

  if (loading) {
    return <div className="loading-container">Cargando planes de acción...</div>;
  }

  return (
    <div className="container">
      {!selectedDimension ? (
        <>
          <div className="page-header">
            <h1>Planes de Acción</h1>
            <button onClick={handleCreatePlan} className="primary-button">+ Nuevo Plan</button>
          </div>
          
          <FilterBar 
            filters={filters}
            onFilterChange={handleFilterChange} 
            dataToExport={exportData}
          />
          
          <div className="dimension-grid">
            {DIMENSION_ORDER.map(dimension => {
              if (groupedPlanes[dimension]) {
                const planCount = Object.values(groupedPlanes[dimension]).flat().length;
                if (planCount > 0) {
                  return (
                    <DimensionCard
                      key={dimension}
                      dimensionName={dimension.replace(' (**)', '')}
                      planCount={planCount}
                      onClick={() => handleSelectDimension(dimension)}
                    />
                  );
                }
              }
              return null;
            })}
          </div>
           {Object.keys(groupedPlanes).length === 0 && !loading && (
              <p className="no-results-message">No se encontraron planes que coincidan con los filtros aplicados.</p>
           )}
        </>
      ) : (
        <>
          <div className="page-header">
            <button onClick={handleBackToDimensions} className="back-button-page">&larr; Volver a Dimensiones</button>
            <h1>{selectedDimension.replace(' (**)', '')}</h1>
            <div className="view-switcher">
              <button className={viewMode === 'cards' ? 'active' : ''} onClick={() => setViewMode('cards')}>Tarjetas</button>
              <button className={viewMode === 'gantt' ? 'active' : ''} onClick={() => setViewMode('gantt')}>Gantt</button>
            </div>
          </div>
          
          {viewMode === 'cards' ? (
            <>
              <p>Planes de acción agrupados por tópico.</p>
              <div className="topics-container">
                {Object.keys(groupedPlanes[selectedDimension]).map(topic => (
                  <TopicAccordion
                    key={topic}
                    topicName={topic}
                    plans={groupedPlanes[selectedDimension][topic]}
                    onVerDetalles={handleEditPlan}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <p>Diagrama de Gantt de los planes de acción para esta dimensión.</p>
              <GanttChart data={Object.values(groupedPlanes[selectedDimension]).flat()} />
            </>
          )}
        </>
      )}

      {isModalOpen && (
        <ModalPlanDeAccion 
          planInicial={selectedPlan} 
          onClose={handleCloseModal}
          onSave={handleSavePlan}
          isCreating={isCreating}
        />
      )}
    </div>
  );
};

export default PlanesDeAccion;