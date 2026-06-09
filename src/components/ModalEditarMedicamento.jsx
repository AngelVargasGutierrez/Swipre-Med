import React, { useState, useEffect } from 'react';
import { X, Save, Edit2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ModalEditarMedicamento({ medicamento, onClose, onUpdated }) {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    laboratorio: '',
    lote: '',
    stock: '',
    stockMin: '',
    costoUnit: '',
    precioVenta: '',
    vencimiento: ''
  });
  const [saving, setSaving] = useState(false);

  // Convierte DD/MM/YYYY o ISO a YYYY-MM-DD para el input
  const formatForInput = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('T')) return dateStr.split('T')[0];
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        // Asumiendo DD/MM/YYYY
        if (parts[2].length === 4) return `${parts[2]}-${parts[1]}-${parts[0]}`;
        // Asumiendo YYYY/MM/DD
        if (parts[0].length === 4) return `${parts[0]}-${parts[1]}-${parts[2]}`;
      }
    }
    return dateStr;
  };

  useEffect(() => {
    if (medicamento) {
      setFormData({
        ...medicamento,
        vencimiento: formatForInput(medicamento.vencimiento)
      });
    }
  }, [medicamento]);

  if (!medicamento) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateMedicamento(medicamento.id, { 
        ...formData, 
        role: user?.role, 
        usuario: user?.name 
      });
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '1rem'
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '600px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          backgroundColor: '#f8fafc'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Edit2 size={20} color="#3b82f6" /> Editar Medicamento
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Nombre del medicamento</label>
              <input required className="form-input" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Laboratorio</label>
              <input className="form-input" value={formData.laboratorio || ''} onChange={e => setFormData({...formData, laboratorio: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Categoría</label>
              <input className="form-input" value={formData.categoria || ''} onChange={e => setFormData({...formData, categoria: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">N° de Lote</label>
              <input required className="form-input" value={formData.lote || ''} onChange={e => setFormData({...formData, lote: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha Vencimiento</label>
              <input required type="date" className="form-input" value={formData.vencimiento} onChange={e => setFormData({...formData, vencimiento: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Stock Actual</label>
              <input required type="number" className="form-input" value={formData.stock || ''} onChange={e => setFormData({...formData, stock: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Stock Mínimo</label>
              <input required type="number" className="form-input" value={formData.stockMin || ''} onChange={e => setFormData({...formData, stockMin: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Costo Unitario ($)</label>
              <input required type="number" step="0.01" className="form-input" value={formData.costoUnit || ''} onChange={e => setFormData({...formData, costoUnit: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Precio Venta ($)</label>
              <input required type="number" step="0.01" className="form-input" value={formData.precioVenta || ''} onChange={e => setFormData({...formData, precioVenta: e.target.value})} />
            </div>

          </div>

          <div style={{
            padding: '16px 24px', borderTop: '1px solid #f1f5f9', backgroundColor: '#f8fafc',
            display: 'flex', justifyContent: 'flex-end', gap: '12px'
          }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
