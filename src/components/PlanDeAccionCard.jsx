// src/components/PlanDeAccionCard.jsx
import React, { useMemo } from 'react';
import ProgressBar from './ProgressBar';

const PlanDeAccionCard = ({ plan, onVerDetalles }) => {
  if (!plan) return null;

  const isOverdue = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fechaFin = plan.fechaFin ? new Date(plan.fechaFin) : null;
    return fechaFin && !isNaN(fechaFin.getTime()) && fechaFin < today && (plan.estado || 0) < 100;
  }, [plan.fechaFin, plan.estado]);

  return (
    <div className={`plan-card ${isOverdue ? 'overdue' : ''}`} onClick={() => onVerDetalles(plan)}>
      <div className="plan-card-header">
        <span className="plan-card-dimension">{(plan.dimension || '').replace(' (**)', '')}</span>
        {isOverdue && <span className="overdue-badge">Vencido</span>}
      </div>

      <h3>{plan.topico || 'Tópico no definido'}</h3>
      <p className="plan-card-subtitle">{plan.accionRecomendada || 'Acción no definida'}</p>
      
      <ProgressBar progress={plan.estado || 0} />
      
      <div className="plan-card-details">
        <div><strong>Duración:</strong> <span>{plan.fechaInicio || 'N/A'} &rarr; {plan.fechaFin || 'N/A'}</span></div>
        <div><strong>Responsables:</strong> <span>{plan.responsables && plan.responsables.length > 0 ? plan.responsables.join(', ') : 'No asignado'}</span></div>
      </div>
    </div>
  );
};

export default PlanDeAccionCard;