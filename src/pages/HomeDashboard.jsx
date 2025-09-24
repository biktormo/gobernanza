import React from 'react';
import { Link } from 'react-router-dom';

// Iconos en formato de componente React para mantener el código limpio
const IconDiagnostico = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M8,12H16V14H8V12M8,16H16V18H8V16Z" />
  </svg>
);

const IconPlanes = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M16.2,16.5L11,13V7H12.5V12.2L17,14.9L16.2,16.5M7,12H9V14H7V12M15,12H17V14H15V12M11,16H13V18H11V16Z" />
  </svg>
);

const IconSeguimiento = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z" />
  </svg>
);


const HomeDashboard = () => {
  return (
    <div className="container home-container">
      <div className="welcome-message">
        <h1>Plan de Gobierno Corporativo</h1>
        <p>Bienvenido. Selecciona una opción para continuar.</p>
      </div>

      <div className="home-grid new-grid">
        <Link to="/diagnostico" className="home-card">
          <div className="home-card-icon">
            <IconDiagnostico />
          </div>
          <h2 className="home-card-title">Diagnóstico Interactivo</h2>
          <p className="home-card-description">Explorar las 16 observaciones y recomendaciones del reporte.</p>
        </Link>
        <Link to="/planes-de-accion" className="home-card">
          <div className="home-card-icon">
            <IconPlanes />
          </div>
          <h2 className="home-card-title">Planes de Acción</h2>
          <p className="home-card-description">Seguimiento de tareas, responsables y fechas de cumplimiento.</p>
        </Link>
        <Link to="/seguimiento" className="home-card">
          <div className="home-card-icon">
            <IconSeguimiento />
          </div>
          <h2 className="home-card-title">Dashboard de Seguimiento</h2>
          <p className="home-card-description">Visualizar indicadores y gráficos del progreso general.</p>
        </Link>
      </div>
    </div>
  );
};

export default HomeDashboard;