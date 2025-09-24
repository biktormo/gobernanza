import React from 'react';

const ProgressBar = ({ progress }) => {
  // Determina el color basado en el progreso
  const safeProgress = progress || 0;
  const progressColor = progress < 30 ? '#e74c3c' : progress < 70 ? '#f39c12' : '#2ecc71';

  return (
    <div className="progress-bar-container">
      <div 
        className="progress-bar-fill" 
        style={{ width: `${progress}%`, backgroundColor: progressColor }}
      ></div>
      <span className="progress-bar-text">{progress}%</span>
    </div>
  );
};

export default ProgressBar;