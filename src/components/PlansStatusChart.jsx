// src/components/PlansStatusChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

// Definimos los colores para cada estado
const COLORS = {
  notStarted: '#95a5a6',  // Gris sutil
  inProgress: '#3498db',  // Azul
  overdue: '#e74c3c',     // Rojo (peligro)
  completed: '#2ecc71',   // Verde (éxito)
};

const PlansStatusChart = ({ data }) => {
  // Preparamos los datos en el formato que Recharts espera
  const chartData = [
    { name: 'Sin Iniciar', planes: data.notStarted, fill: COLORS.notStarted },
    { name: 'En Progreso', planes: data.inProgress, fill: COLORS.inProgress },
    { name: 'Vencidos', planes: data.overdue, fill: COLORS.overdue },
    // --- CORRECCIÓN AQUÍ ---
    { name: 'Completados', planes: data.completed, fill: COLORS.completed },
  ];
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <strong>{label}:</strong> {payload[0].value} planes
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <h3>Planes por Estado</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0,0,0,0.05)'}} />
          
          <Bar dataKey="planes" name="Nº de Planes">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlansStatusChart;