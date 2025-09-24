// src/components/CircularProgressBar.jsx
import React from 'react';

const CircularProgressBar = ({ progress }) => {
  const size = 180;
  const strokeWidth = 15;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="progress-container">
      <svg className="progress-ring" width={size} height={size}>
        <circle
          className="progress-ring-bg"
          strokeWidth={strokeWidth}
          cx={center}
          cy={center}
          r={radius}
        />
        <circle
          className="progress-ring-fg"
          strokeWidth={strokeWidth}
          cx={center}
          cy={center}
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="progress-text">
        <span>{progress}%</span>
        <p>Progreso General</p>
      </div>
    </div>
  );
};

export default CircularProgressBar;