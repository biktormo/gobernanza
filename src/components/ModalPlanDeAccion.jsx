// src/components/ModalPlanDeAccion.jsx
import React, { useState, useEffect } from 'react';
import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';

const ModalPlanDeAccion = ({ planInicial, onClose, onSave, isCreating }) => {
  const [planData, setPlanData] = useState(planInicial);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [responsableInput, setResponsableInput] = useState('');

  useEffect(() => {
    setPlanData(planInicial);
  }, [planInicial]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlanData(prev => ({ ...prev, [name]: value }));
  };

  const handleProgressChange = (e) => {
    setPlanData(prev => ({ ...prev, estado: Number(e.target.value) }));
  };
  
  const handleAddResponsable = (e) => {
    e.preventDefault();
    if (responsableInput && !planData.responsables.includes(responsableInput)) {
      setPlanData(prev => ({
        ...prev,
        responsables: [...prev.responsables, responsableInput.trim()]
      }));
      setResponsableInput('');
    }
  };

  const handleRemoveResponsable = (responsableToRemove) => {
    setPlanData(prev => ({
      ...prev,
      responsables: prev.responsables.filter(r => r !== responsableToRemove)
    }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || isCreating) {
      if(isCreating) toast.error("Guarda el plan primero para poder adjuntar evidencia.");
      return;
    }

    const uploadPromise = uploadBytes(ref(storage, `evidencia/${planData.id}/${Date.now()}_${file.name}`), file)
        .then(snapshot => getDownloadURL(snapshot.ref))
        .then(downloadURL => {
            setPlanData(prev => ({
                ...prev,
                evidenciaArchivos: [...prev.evidenciaArchivos, { nombre: file.name, url: downloadURL }]
            }));
        });

    toast.promise(uploadPromise, {
        loading: 'Subiendo archivo...',
        success: 'Archivo subido con éxito!',
        error: 'No se pudo subir el archivo.',
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(planData);
    } finally {
      setIsSaving(false);
    }
  };

  if (!planData) return null;

  return (
    <div className="modal-overlay">
      <form className="modal-content" onSubmit={handleSubmit}>
        <div className="modal-header">
          <h2>{isCreating ? 'Crear Nuevo Plan de Acción' : 'Detalles del Plan de Acción'}</h2>
          <button type="button" onClick={onClose} className="close-button">&times;</button>
        </div>
        
        {!isCreating && (
          <div className="context-section-top">
            <h4>Contexto del Diagnóstico</h4>
            <p><strong>Dimensión:</strong> {planData.dimension}</p>
            <p><strong>Tópico:</strong> {planData.topico}</p>
          </div>
        )}

        <div className="modal-body">
          <div className="form-section">
            <h3>Plan de Acción</h3>
            <div className="form-grid">
              
              <div className="form-group full-width">
                <label>Acción Recomendada / Título del Plan</label>
                <textarea name="accionRecomendada" value={planData.accionRecomendada} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Nivel de Prioridad</label>
                <select name="nivelPrioridad" value={planData.nivelPrioridad} onChange={handleChange}>
                  <option value="No definido">Seleccionar...</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>

              <div className="form-group">
                <label>Progreso: {planData.estado}%</label>
                <input type="range" min="0" max="100" name="estado" value={planData.estado} onChange={handleProgressChange} />
              </div>

              {/* --- CAMPOS RESTAURADOS --- */}
              <div className="form-group">
                <label>Fecha de Inicio</label>
                <input type="date" name="fechaInicio" value={planData.fechaInicio} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Fecha Límite</label>
                <input type="date" name="fechaFin" value={planData.fechaFin} onChange={handleChange} required />
              </div>

              <div className="form-group full-width">
                <label>Responsables</label>
                <div className="responsables-list">
                  {planData.responsables && planData.responsables.map(r => (
                    <span key={r} className="tag">{r} <button type="button" onClick={() => handleRemoveResponsable(r)}>x</button></span>
                  ))}
                </div>
                <div className="responsables-input">
                  <input type="text" placeholder="Añadir responsable..." value={responsableInput} onChange={(e) => setResponsableInput(e.target.value)} />
                  <button type="button" onClick={handleAddResponsable}>Añadir</button>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Ideas / Acciones a Implementar</label>
                <textarea name="ideasAcciones" value={planData.ideasAcciones} onChange={handleChange}></textarea>
              </div>

              <div className="form-group full-width">
                <label>Observaciones Adicionales</label>
                <textarea name="observacionesAdicionales" value={planData.observacionesAdicionales} onChange={handleChange}></textarea>
              </div>

              {/* --- SECCIÓN DE EVIDENCIA RESTAURADA --- */}
              {!isCreating && (
                <div className="form-group full-width evidence-section">
                   <h4>Evidencia</h4>
                    <p><strong>Descripción de evidencia (del CSV):</strong> {planData.evidenciaDescripcion || 'N/A'}</p>
                    <ul>
                      {planData.evidenciaArchivos && planData.evidenciaArchivos.map((ev, index) => (
                        <li key={index}><a href={ev.url} target="_blank" rel="noopener noreferrer">{ev.nombre}</a></li>
                      ))}
                    </ul>
                    <div className="upload-area">
                      <label htmlFor="file-upload" className={`custom-file-upload ${isCreating ? 'disabled' : ''}`}>+ Cargar Archivo</label>
                      <input id="file-upload" type="file" onChange={handleFileChange} disabled={isCreating || isUploading} />
                      {isUploading && <p>Subiendo...</p>}
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="secondary-button" disabled={isSaving}>Cancelar</button>
          <button type="submit" className="primary-button" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalPlanDeAccion;