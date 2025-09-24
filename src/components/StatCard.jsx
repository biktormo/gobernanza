// src/components/StatCard.jsx
import React from 'react';

const StatCard = ({ value, title, type = 'default' }) => {
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
    </div>
  );
};

export default StatCard;