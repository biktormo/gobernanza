// src/components/DimensionProgressCard.jsx
import React from 'react';

// Un componente de progreso circular más pequeño y adaptable
const MiniCircularProgress = ({ progress }) => {
    const size = 60;
    const strokeWidth = 6;
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="mini-progress-container">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle className="progress-ring-bg" cx={center} cy={center} r={radius} strokeWidth={strokeWidth} />
                <circle className="progress-ring-fg" cx={center} cy={center} r={radius} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} />
            </svg>
            <div className="mini-progress-text">{progress}%</div>
        </div>
    );
};


const DimensionProgressCard = ({ dimensionName, progress }) => {
  return (
    <div className="dimension-progress-card">
      <div className="dimension-progress-info">
        <h3>{dimensionName}</h3>
      </div>
      <MiniCircularProgress progress={progress} />
    </div>
  );
};

export default DimensionProgressCard;