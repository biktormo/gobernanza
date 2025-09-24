// src/components/DimensionCard.jsx
import React from 'react';

const DimensionCard = ({ dimensionName, planCount, onClick }) => {
  return (
    <div className="dimension-card" onClick={onClick}>
      <div className="dimension-card-content">
        <h2>{dimensionName}</h2>
        <p>{planCount} {planCount === 1 ? 'Plan de Acción' : 'Planes de Acción'}</p>
      </div>
      <div className="dimension-card-footer">
        Ver detalles &rarr;
      </div>
    </div>
  );
};

export default DimensionCard;