// src/pages/Diagnostico.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

// Componente reutilizable para el acordeón (lo definimos aquí mismo para simplicidad)
const AccordionItem = ({ title, count, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="topic-accordion">
            <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <span>{title} ({count})</span>
                <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>&#9660;</span>
            </button>
            {isOpen && <div className="accordion-content">{children}</div>}
        </div>
    );
};


const Diagnostico = () => {
    const [planes, setPlanes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlanes = async () => {
            const querySnapshot = await getDocs(collection(db, 'planesDeAccion'));
            const planesData = querySnapshot.docs.map(doc => doc.data());
            // Ordenamos por el índice del CSV para mantener el orden lógico
            planesData.sort((a, b) => (a.actionIndex || 0) - (b.actionIndex || 0));
            setPlanes(planesData);
            setLoading(false);
        };
        fetchPlanes();
    }, []);

    // --- AGRUPACIÓN INTELIGENTE DE DATOS ---
    const groupedData = useMemo(() => {
        return planes.reduce((acc, plan) => {
            const { dimension, topico, diagnostico, riesgosPotenciales, accionRecomendada } = plan;

            // Inicializa la dimensión si no existe
            if (!acc[dimension]) {
                acc[dimension] = {};
            }
            // Inicializa el tópico si no existe
            if (!acc[dimension][topico]) {
                acc[dimension][topico] = {
                    diagnostico: diagnostico, // Guardamos el diagnóstico una sola vez
                    riesgos: riesgosPotenciales, // Guardamos los riesgos una sola vez
                    acciones: [] // Creamos una lista para las acciones
                };
            }
            // Añadimos la acción recomendada a la lista
            acc[dimension][topico].acciones.push(accionRecomendada);
            
            return acc;
        }, {});
    }, [planes]);

    // Usamos el mismo orden que en la otra página para consistencia
    const DIMENSION_ORDER = [
        "General", "Administración y Conformación del Directorio (**)",
        "Control, ética y conflicto de interés", "Transparencia de Stakeholders",
        "Derecho de los accionistas o socios", "Gobierno Familiar"
    ];

    if (loading) {
        return <div className="loading-container">Cargando diagnóstico...</div>;
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1>Diagnóstico Interactivo</h1>
            </div>
            <p>Observaciones y recomendaciones del reporte original, agrupadas por tópico.</p>
            
            <div className="topics-container">
                {DIMENSION_ORDER.map(dim => {
                    const topicsInDim = groupedData[dim];
                    if (topicsInDim) {
                        return (
                            <AccordionItem 
                                key={dim} 
                                title={dim.replace(' (**)', '')} 
                                count={`${Object.keys(topicsInDim).length} tópicos`}
                            >
                                {Object.keys(topicsInDim).map(topic => {
                                    const topicData = topicsInDim[topic];
                                    return (
                                        <div key={topic} className="diagnostico-card">
                                            <h3>{topic}</h3>
                                            
                                            {/* --- DIAGNÓSTICO Y RIESGOS (UNA SOLA VEZ) --- */}
                                            <h4>Diagnóstico Original</h4>
                                            <p>{topicData.diagnostico}</p>
                                            
                                            <h4>Riesgos Potenciales</h4>
                                            <p>{topicData.riesgos}</p>
                                            
                                            {/* --- LISTA DE ACCIONES RECOMENDADAS --- */}
                                            <h4>Acciones Recomendadas ({topicData.acciones.length})</h4>
                                            <ul className="acciones-list">
                                                {topicData.acciones.map((accion, index) => (
                                                    <li key={index}>{accion}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </AccordionItem>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default Diagnostico;