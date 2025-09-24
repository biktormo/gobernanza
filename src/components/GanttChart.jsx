// src/components/GanttChart.jsx
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

// Función para obtener el color según el progreso
const getProgressColor = (progress) => {
    if (progress <= 40) return '#e74c3c'; // Rojo
    if (progress <= 60) return '#f1c40f'; // Amarillo
    if (progress <= 80) return '#2ecc71'; // Verde Claro
    return '#27ae60'; // Verde Oscuro (para completado)
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="gantt-tooltip">
        <p className="label">{data.fullName}</p>
        <p className="intro"><strong>Inicio:</strong> {new Date(data.start).toLocaleDateString()}</p>
        <p className="intro"><strong>Fin:</strong> {new Date(data.end).toLocaleDateString()}</p>
        <p className="desc" style={{ color: getProgressColor(data.estado) }}>
            <strong>Progreso: {data.estado}%</strong>
        </p>
      </div>
    );
  }
  return null;
};

const GanttChart = ({ data }) => {
  let minDate = Infinity;
  let maxDate = -Infinity;

  // Preparamos los datos y añadimos el color a cada objeto
  const chartData = data
    .map(plan => {
      const start = new Date(plan.fechaInicio);
      const end = new Date(plan.fechaFin);

      if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return null;
      
      if (start.getTime() < minDate) minDate = start.getTime();
      if (end.getTime() > maxDate) maxDate = end.getTime();

      return {
        fullName: plan.accionRecomendada,
        name: plan.accionRecomendada,
        start: start.getTime(),
        end: end.getTime(),
        estado: plan.estado,
        // Añadimos el color directamente al objeto de datos
        fillColor: getProgressColor(plan.estado),
      };
    })
    .filter(Boolean);

  const chartHeight = Math.max(400, chartData.length * 50);
  
  const finalMinDate = isFinite(minDate) ? new Date(minDate).setDate(new Date(minDate).getDate() - 7) : new Date().getTime();
  const finalMaxDate = isFinite(maxDate) ? new Date(maxDate).setDate(new Date(maxDate).getDate() + 7) : new Date().getTime();

  return (
    <div className="gantt-chart-container">
      <ResponsiveContainer width="100%" height={chartHeight} minWidth={1200}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          
          <XAxis 
            type="number" 
            scale="time" 
            domain={[finalMinDate, finalMaxDate]}
            tickFormatter={(time) => new Date(time).toLocaleDateString()}
            padding={{ left: 20, right: 20 }}
          />
          
          <YAxis 
            dataKey="name" 
            type="category" 
            width={300}
            tickFormatter={(name) => (name.length > 45 ? `${name.substring(0, 45)}...` : name)}
            interval={0}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend content={() => null} /> {/* Ocultamos la leyenda */}

          {/* --- UNA SOLA BARRA CON COLORES DINÁMICOS --- */}
          <Bar 
            dataKey={(payload) => [payload.start, payload.end]} 
            name="Duración del Plan"
            barSize={20} 
            shape={<rect />}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fillColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GanttChart;