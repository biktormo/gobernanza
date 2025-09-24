// src/components/FilterBar.jsx
import React from 'react';
import { CSVLink } from 'react-csv';

const FilterBar = ({ filters, onFilterChange, dataToExport }) => {
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Llamamos a la función del componente padre para actualizar el estado
    onFilterChange({ ...filters, [name]: value });
  };

  const handleReset = () => {
    // Reseteamos al estado inicial
    onFilterChange({
      searchTerm: '',
      priority: 'all',
      status: 'all',
      sortBy: 'actionIndex-asc' 
    });
  };

  const csvHeaders = [ /* ... (sin cambios) ... */ ];

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Buscar por Tópico/Acción:</label>
        <input
          type="text"
          name="searchTerm"
          placeholder="Ej: Código de Conducta..."
          value={filters.searchTerm || ''}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label>Prioridad:</label>
        <select name="priority" value={filters.priority || 'all'} onChange={handleChange}>
          <option value="all">Todas</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Estado:</label>
        <select name="status" value={filters.status || 'all'} onChange={handleChange}>
          <option value="all">Todos</option>
          <option value="overdue">Vencidos</option>
          <option value="completed">Completados (100%)</option>
          <option value="inProgress">En Progreso (1-99%)</option>
          <option value="notStarted">Sin Iniciar (0%)</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Ordenar por:</label>
        <select name="sortBy" value={filters.sortBy || 'actionIndex-asc'} onChange={handleChange}>
          <option value="actionIndex-asc">Orden Original</option>
          <option value="fechaFin-asc">Fecha Límite (Próximos)</option>
          <option value="fechaFin-desc">Fecha Límite (Lejanos)</option>
          <option value="estado-desc">Progreso (Mayor a Menor)</option>
          <option value="estado-asc">Progreso (Menor a Mayor)</option>
          <option value="prioridad-desc">Prioridad (Alta a Baja)</option>
        </select>
      </div>
      
      <div className="filter-actions">
        <button type="button" onClick={handleReset} className="secondary-button">Limpiar</button>
        <CSVLink
          data={dataToExport}
          headers={csvHeaders}
          filename={"planes_de_accion_sartor.csv"}
          className="primary-button"
        >
          Exportar
        </CSVLink>
      </div>
    </div>
  );
};

export default FilterBar;