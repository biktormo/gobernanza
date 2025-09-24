// src/components/TopicAccordion.jsx
import React, { useState } from 'react';
import PlanDeAccionCard from './PlanDeAccionCard';

const TopicAccordion = ({ topicName, plans, onVerDetalles }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="topic-accordion">
      <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{topicName} ({plans.length} {plans.length === 1 ? 'plan' : 'planes'})</span>
        <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>&#9660;</span>
      </button>
      
      {isOpen && (
        <div className="accordion-content">
          <div className="planes-grid-accordion">
            {plans.map(plan => (
              <PlanDeAccionCard
                key={plan.id}
                plan={plan}
                onVerDetalles={onVerDetalles}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicAccordion;