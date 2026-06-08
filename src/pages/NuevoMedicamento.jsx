import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Search, CheckCircle, FlaskConical } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LOTE_EMPTY = {
  lote: '', vencimiento: '', costoUnit: '',
  precioVenta: '', stockMin: '', stockInicial: '', rSanitario: '',
};

const norm = (s) => (s || '').trim().toLowerCase();

export default function NuevoMedicamento({ onBack }) {
  const { user } = useAuth();

  const [laboratorios, setLaboratorios] = useState([]);
  const [existentes,   setExistentes]   = useState([]);

  const [labSelected, setLabSelected] = useState('');

  const [medSearch,    setMedSearch]    = useState('');
  const [suggestions,  setSuggestions]  = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [noResults,    setNoResults]    = useState(false);
  const [medSelected,  setMedSelected]  = useState(null);

  const [lote,   setLoteData] = useState(LOTE_EMPTY);
  const [saving, setSaving]   = useState(false);
  const [ok,     setOk]       = useState(false);

  const getMatches = useCallback((query) => {
    if (!labSelected) return [];
    const q = query.trim().toLowerCase();
    return existentes
      .filter(m =>
        norm(m.laboratorio) === norm(labSelected) &&
        (!q || m.nombre.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [labSelected, existentes]);

  const showSuggestions = useCallback((matches, query = '') => {
    setSuggestions(matches);
    setShowDropdown(matches.length > 0);
    setNoResults(matches.length === 0 && !!labSelected && query.trim().length > 0);
  }, [labSelected]);

  useEffect(() => {
    Promise.all([api.getLaboratorios(), api.getMedicamentos()])
      .then(([labs, meds]) => {
        setLaboratorios(labs);
        setExistentes(meds);
      })
      .catch(console.error);
  }, []);

  function handleLabChange(e) {
    const lab = e.target.value.trim();
    setLabSelected(lab);
    setMedSearch('');
    setSuggestions([]);
    setShowDropdown(false);
    setNoResults(false);
    setMedSelected(null);
  }

  function handleMedSearch(e) {
    const val = e.target.value;
    setMedSearch(val);
    setMedSelected(null);

    if (!labSelected) {
      setSuggestions([]);
      setShowDropdown(false);
      setNoResults(false);
      return;
    }

    const matches = getMatches(val);
    showSuggestions(matches, val);
  }

  function handleSearchFocus() {
    if (!labSelected || medSelected) return;
    const matches = getMatches(medSearch);
    showSuggestions(matches, medSearch);
  }

  function selectSuggestion(m) {
    setMedSelected(m);
    setMedSearch(m.nombre);
    setSuggestions([]);
    setShowDropdown(false);
    setNoResults(false);
  }

  function setField(field, value) {
    setLoteData(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!medSelected) {
      alert('Selecciona un medicamento de las sugerencias del buscador.');
      return;
    }
    const { costoUnit, precioVenta, stockMin, stockInicial, lote: loteNum, vencimiento } = lote;
    if (!loteNum || !vencimiento) {
      alert('Número de lote y fecha de vencimiento son obligatorios.');
      return;
    }
    if (Number(costoUnit) <= 0) {
      alert('El costo unitario de compra debe ser mayor a 0.');
      return;
    }
    if (Number(precioVenta) < 0 || Number(stockMin) < 0 || Number(stockInicial) < 0) {
      alert('Precio y stocks no pueden ser negativos.');
      return;
    }
    if (Number(stockInicial) <= 0) {
      alert('El stock inicial del lote debe ser mayor a 0.');
      return;
    }

    setSaving(true);
    try {
      const vencFmt = vencimiento.split('-').reverse().join('/');
      await api.registrarLote(medSelected.id, {
        lote:         loteNum,
        vencimiento:  vencFmt,
        costoUnit:    parseFloat(costoUnit),
        precioVenta:  parseFloat(precioVenta)  || 0,
        stockMin:     parseInt(stockMin, 10)   || 0,
        stockInicial: parseInt(stockInicial, 10),
        rSanitario:   lote.rSanitario,
        usuario:      user?.name || user?.username || 'Sistema',
      });
      setOk(true);
      setTimeout(() => onBack(), 1800);
    } catch (err) {
      alert(`Error: ${err.message}`);
      setSaving(false);
    }
  }

  if (ok) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: 340, gap: 18,
      }}>
        <CheckCircle size={64} color="#22c55e" />
        <h2 style={{ color: '#22c55e', margin: 0 }}>Lote registrado correctamente.</h2>
        <p style={{ color: '#64748b' }}>Stock actualizado. Redirigiendo al listado…</p>
      </div>
    );
  }

  return (
    <>
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: 20 }}>
        <ArrowLeft size={16} /> Volver a Medicamentos
      </button>

      <h1 className="page-title">Registrar lote — medicamento existente</h1>
      <p className="page-subtitle">
        Busca un medicamento ya catalogado y registra los datos del nuevo lote físico.
      </p>

      <form onSubmit={handleSubmit} autoComplete="off">

        <div className="form-section">
          <div className="search-card" style={{ marginBottom: 0 }}>
            <div className="search-card-title">
              <Search size={18} /> Buscar medicamento en catálogo
            </div>
            <div className="search-card-desc">
              Selecciona el laboratorio y escribe el nombre; el sistema muestra hasta 6 coincidencias.
              Al elegir una, se completan nombre, laboratorio y categoría (solo lectura).
            </div>

            <div className="form-group">
              <label className="form-label">Paso 1: Laboratorio fabricante *</label>
              <select className="form-select" value={labSelected} onChange={handleLabChange}>
                <option value="">-- Seleccionar laboratorio --</option>
                {laboratorios.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Paso 2: Buscar medicamento *</label>

              {!labSelected ? (
                <div className="search-placeholder">
                  Primero selecciona un laboratorio para habilitar la búsqueda
                </div>
              ) : (
                <div className="med-search-wrap">
                  <Search size={15} className="med-search-icon" />
                  <input
                    className="form-input med-search-input"
                    placeholder="Escribe el nombre del medicamento…"
                    value={medSearch}
                    onChange={handleMedSearch}
                    onFocus={handleSearchFocus}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 220)}
                    disabled={!!medSelected}
                    aria-autocomplete="list"
                    aria-expanded={showDropdown}
                    aria-controls="med-suggestions-list"
                  />
                  {medSelected && (
                    <button
                      type="button"
                      className="med-search-clear"
                      onClick={() => {
                        setMedSelected(null);
                        setMedSearch('');
                        setNoResults(false);
                        showSuggestions(getMatches(''), '');
                      }}
                    >
                      Cambiar
                    </button>
                  )}

                  {showDropdown && suggestions.length > 0 && (
                    <ul
                      id="med-suggestions-list"
                      className="med-autocomplete-dropdown"
                      role="listbox"
                    >
                      <li className="med-autocomplete-header" role="presentation">
                        {suggestions.length} sugerencia{suggestions.length > 1 ? 's' : ''}
                      </li>
                      {suggestions.map((m) => (
                        <li
                          key={m.id}
                          role="option"
                          className="med-autocomplete-item"
                          onMouseDown={(e) => { e.preventDefault(); selectSuggestion(m); }}
                        >
                          <FlaskConical size={15} color="#6366f1" />
                          <div>
                            <div className="med-autocomplete-name">{m.nombre}</div>
                            <div className="med-autocomplete-meta">
                              {m.categoria} · Stock actual: {m.stock}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {noResults && medSearch.trim() && !medSelected && (
                    <div className="med-autocomplete-empty">
                      No hay coincidencias para &quot;{medSearch}&quot; en este laboratorio.
                    </div>
                  )}
                </div>
              )}

              <div className="ai-tip" style={{ marginTop: 10 }}>
                <span>ℹ️</span>
                <span>Escribe al menos una letra o haz clic en el campo para ver sugerencias (máx. 6).</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">Información del medicamento (catálogo)</div>

          <div className="form-group">
            <label className="form-label">Nombre del medicamento *</label>
            <input
              className="form-input field-readonly"
              placeholder="Selecciona una sugerencia del paso 2…"
              value={medSelected ? medSelected.nombre : ''}
              readOnly
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Laboratorio *</label>
              <input
                className="form-input field-readonly field-lab"
                value={medSelected ? medSelected.laboratorio : labSelected}
                readOnly
              />
            </div>
            <div className="form-group">
              <label className="form-label">Categoría *</label>
              <input
                className="form-input field-readonly"
                value={medSelected ? medSelected.categoria : ''}
                placeholder="—"
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="manual-section">
          <div className="manual-section-title">Datos del nuevo lote físico</div>
          <div className="manual-section-desc">Completa según boleta de compra y etiqueta del producto</div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Número de lote *</label>
              <input className="form-input" placeholder="Ej: PAR-2024-001"
                value={lote.lote} onChange={e => setField('lote', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Fecha de vencimiento (DD/MM/AAAA) *</label>
              <input className="form-input" type="date"
                value={lote.vencimiento} onChange={e => setField('vencimiento', e.target.value)} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Costo unitario de compra ($) * <span className="label-hint">(según boleta)</span>
              </label>
              <input className="form-input" type="number" min="0.01" step="0.01" placeholder="0.00"
                value={lote.costoUnit} onChange={e => setField('costoUnit', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Precio de venta al público ($) *</label>
              <input className="form-input" type="number" min="0" step="0.01" placeholder="0.00"
                value={lote.precioVenta} onChange={e => setField('precioVenta', e.target.value)} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Stock mínimo de seguridad * <span className="label-hint">(política interna)</span>
              </label>
              <input className="form-input" type="number" min="0" placeholder="0"
                value={lote.stockMin} onChange={e => setField('stockMin', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Stock inicial de este lote *</label>
              <input className="form-input" type="number" min="1" placeholder="0"
                value={lote.stockInicial} onChange={e => setField('stockInicial', e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Registro sanitario <span className="label-hint">(opcional)</span>
            </label>
            <input className="form-input" placeholder="Ej: RSS-001-2024"
              value={lote.rSanitario} onChange={e => setField('rSanitario', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: 'center', padding: '14px' }}
            disabled={saving || !medSelected}
          >
            {saving ? 'Guardando…' : 'Registrar lote'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onBack} disabled={saving}>
            Cancelar
          </button>
        </div>

      </form>
    </>
  );
}
