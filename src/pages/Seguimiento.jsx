import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

// Componentes del Dashboard
import StatCard from '../components/StatCard';
import CircularProgressBar from '../components/CircularProgressBar';
import PlansStatusChart from '../components/PlansStatusChart';
import DimensionProgressCard from '../components/DimensionProgressCard'; // La nueva tarjeta de dimensión

const Seguimiento = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'planesDeAccion'));
        const plansData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlans(plansData);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Usamos useMemo para calcular todas las métricas de una sola vez y de forma eficiente
  const { stats, dimensionProgress } = useMemo(() => {
    if (plans.length === 0) {
      // Devuelve un estado por defecto si no hay datos para evitar errores
      return { 
        stats: { total: 0, completed: 0, inProgress: 0, overdue: 0, notStarted: 0, overallProgress: 0 },
        dimensionProgress: {} 
      };
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let completed = 0;
    let inProgress = 0;
    let overdue = 0;
    let notStarted = 0;
    let totalProgress = 0;

    // 1. Cálculo de las estadísticas generales (KPIs)
    plans.forEach(p => {
        if (p.estado === 100) completed++;
        else if (p.estado > 0) inProgress++;
        else notStarted++;

        const fechaFin = new Date(p.fechaFin);
        if (!isNaN(fechaFin) && fechaFin < today && p.estado < 100) {
            overdue++;
        }
        totalProgress += p.estado || 0;
    });
    
    const overallProgress = Math.round(totalProgress / plans.length);

    const calculatedStats = {
      total: plans.length,
      completed,
      inProgress,
      overdue,
      notStarted,
      overallProgress,
    };

    // 2. Cálculo del progreso promedio por cada dimensión
    const progressByDimension = plans.reduce((acc, plan) => {
        const { dimension } = plan;
        if (!acc[dimension]) {
            acc[dimension] = { total: 0, count: 0 };
        }
        acc[dimension].total += plan.estado || 0;
        acc[dimension].count += 1;
        return acc;
    }, {});

    Object.keys(progressByDimension).forEach(dim => {
        progressByDimension[dim].average = Math.round(progressByDimension[dim].total / progressByDimension[dim].count);
    });

    // Devolvemos ambos resultados
    return { stats: calculatedStats, dimensionProgress: progressByDimension };

  }, [plans]);

  // Usamos el mismo orden de dimensiones para consistencia en toda la app
  const DIMENSION_ORDER = [
    "General",
    "Administración y Conformación del Directorio (**)",
    "Control, ética y conflicto de interés",
    "Transparencia de Stakeholders",
    "Derecho de los accionistas o socios",
    "Gobierno Familiar"
  ];

  const handleCardClick = (filter) => {
    navigate('/planes-de-accion', { state: { filter } });
  };

  if (loading) {
    return <div className="loading-container">Cargando dashboard...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Dashboard de Seguimiento</h1>
      </div>
      <p>Estado actual de los planes de acción.</p>
      
      <div className="dashboard-grid">
        <div className="main-widget">
            <CircularProgressBar progress={stats.overallProgress} />
        </div>
        
        <div onClick={() => handleCardClick({})}><StatCard value={stats.total} title="Planes Totales" /></div>
        <div onClick={() => handleCardClick({ status: 'completed' })}><StatCard value={stats.completed} title="Completados" /></div>
        <div onClick={() => handleCardClick({ status: 'inProgress' })}><StatCard value={stats.inProgress} title="En Progreso" /></div>
        <div onClick={() => handleCardClick({ status: 'overdue' })}><StatCard value={stats.overdue} title="Vencidos" type="danger" /></div>

        <div className="chart-widget">
          <PlansStatusChart data={stats} />
        </div>

        {/* --- NUEVA SECCIÓN DE PROGRESO POR DIMENSIÓN --- */}
        <div className="dimension-progress-section">
          <h2>Progreso por Dimensión</h2>
          <div className="dimension-progress-grid">
            {DIMENSION_ORDER.map(dimName => {
              const progressInfo = dimensionProgress[dimName];
              // Renderizamos la tarjeta solo si la dimensión existe en los datos
              if (progressInfo) {
                return (
                  <DimensionProgressCard 
                    key={dimName}
                    dimensionName={dimName.replace(' (**)', '')}
                    progress={progressInfo.average}
                  />
                )
              }
              return null;
            })}
          </div>
        </div>

        <Link to="/planes-de-accion" className="nav-card">
          <h2>Gestionar Todos los Planes</h2>
          <p>Ver la lista completa sin filtros.</p>
          <span>Ir a Planes &rarr;</span>
        </Link>
      </div>
    </div>
  );
};

export default Seguimiento;