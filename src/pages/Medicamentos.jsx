import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus,
  Search,
  Sparkles,
  X,
  ChevronDown,
  Building2,
  Pill,
  Database,
  Loader2,
  CheckCircle2,
  Eye,
  Box,
  FileSpreadsheet,
  Filter,
  Edit2
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Loader from '../components/Loader';
import ModalDetalleMedicamento from '../components/ModalDetalleMedicamento';
import ModalEditarMedicamento from '../components/ModalEditarMedicamento';

function hoyMasMeses(meses) {
  const d = new Date();
  d.setMonth(d.getMonth() + meses);
  return d.toISOString().slice(0, 10);
}

function normTxt(s) {
  return String(s || '').trim().toLowerCase();
}

function palabraBase(texto) {
  const m = String(texto || '').trim().toLowerCase().match(/^[a-záéíóúñ]+/i);
  return m ? m[0].toLowerCase() : String(texto || '').trim().toLowerCase().split(/\s+/)[0];
}

function coincideMedicamento(m, q) {
  const t = normTxt(q);
  if (!t) return true;
  const palabra = palabraBase(q);
  const campos = [m.nombre, m.codigo, m.laboratorio, m.categoria].map(normTxt);
  return campos.some(c => c.includes(t) || (palabra.length >= 2 && c.includes(palabra)));
}

function laboratoriosDesdeMedicamentos(medicamentos, q) {
  const labs = new Set();
  for (const m of medicamentos) {
    if (!coincideMedicamento(m, q)) continue;
    if (m.laboratorio) labs.add(m.laboratorio);
  }
  return [...labs].sort();
}

function variantesDesdeMedicamentos(medicamentos, q, lab) {
  const seen = new Set();
  const out = [];
  for (const m of medicamentos) {
    if (!coincideMedicamento(m, q)) continue;
    if (lab && m.laboratorio !== lab) continue;
    const key = normTxt(m.nombre);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      nombre: m.nombre,
      categoria: m.categoria || 'General',
      presentacion: m.nombre,
      fuente: 'Base de datos',
      enInventario: true,
      medicamentoId: m.id,
      codigo: m.codigo,
      laboratorio: m.laboratorio,
      stockActual: m.stock,
      medicamento: m,
    });
  }
  return out;
}

function fusionarVariantes(a, b, max = 12) {
  const out = [];
  const seen = new Set();
  for (const v of [...a, ...b]) {
    const key = normTxt(v.nombre);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(v);
    if (out.length >= max) break;
  }
  return out;
}

function etiquetaMotor(motor) {
  if (motor === 'gemini') return { texto: 'Gemini IA', clase: 'ia-motor-gemini' };
  if (motor === 'base-de-datos') return { texto: 'Base de datos', clase: 'ia-motor-bd' };
  if (motor === 'catalogo-local') return { texto: 'Catálogo local', clase: 'ia-motor-catalogo' };
  return null;
}

export default function Medicamentos({ onNuevo }) {
  const { user } = useAuth();
  const puedeEditar = ['admin', 'almacen', 'logistica'].includes(user?.role);
  
  const [loading, setLoading] = useState(true);
  const [medicamentos, setMedicamentos] = useState([]);

  const [search, setSearch] = useState('');
  const [labFilter, setLabFilter] = useState('');
  const [labsBusqueda, setLabsBusqueda] = useState([]);
  
  // Estado para el filtro del listado general
  const [filtroLaboratorioPrincipal, setFiltroLaboratorioPrincipal] = useState('');

  const [variantes, setVariantes] = useState([]);
  const [motorIA, setMotorIA] = useState('');
  const [iaLoading, setIaLoading] = useState(false);
  const [iaError, setIaError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);

  const [seleccion, setSeleccion] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    laboratorio: '',
    stock: '',
    lote: '',
    vencimiento: hoyMasMeses(12),
    rSanitario: '',
    costoUnit: '',
    precioVenta: '',
  });
  const [guardando, setGuardando] = useState(false);
  const [msgOk, setMsgOk] = useState('');
  const [msgErr, setMsgErr] = useState('');

  // Estado para el modal de detalles
  const [medicamentoDetalle, setMedicamentoDetalle] = useState(null);
  const [medicamentoEditar, setMedicamentoEditar] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const recargar = useCallback(
    () => api.getMedicamentos().then(data => { setMedicamentos(data); return data; }),
    []
  );

  useEffect(() => {
    recargar().finally(() => setLoading(false));
  }, [recargar]);

  useEffect(() => {
    if (seleccion && !seleccion.laboratorio && labFilter) {
      setForm(f => ({ ...f, laboratorio: labFilter }));
    }
  }, [labFilter, seleccion]);

  const cargarVariantes = useCallback(async (q, lab, meds) => {
    const texto = q.trim();
    if (!texto) {
      setVariantes([]);
      setLabsBusqueda([]);
      setMotorIA('');
      setIaError('');
      setHighlightIdx(-1);
      return;
    }

    const locales = variantesDesdeMedicamentos(meds, texto, lab);
    const labsLocal = laboratoriosDesdeMedicamentos(meds, texto);
    setVariantes(locales);
    setLabsBusqueda(labsLocal);
    setMotorIA(locales.length ? 'base-de-datos' : '');
    setIaError('');
    setHighlightIdx(locales.length ? 0 : -1);

    setIaLoading(true);
    try {
      const data = await api.getVariantesIA(texto, lab);
      const remotas = data.variantes || [];
      const fusionadas = fusionarVariantes(locales, remotas, 12);
      setVariantes(fusionadas);
      setLabsBusqueda(
        [...new Set([...(data.laboratorios || []), ...labsLocal])].sort()
      );
      setMotorIA(data.motor || (locales.length ? 'base-de-datos' : ''));
      setHighlightIdx(fusionadas.length ? 0 : -1);
    } catch (err) {
      if (locales.length) {
        setMotorIA('base-de-datos');
        setIaError('');
      } else {
        setIaError(err.message || 'No se pudo conectar con el servidor. Reinicie el backend.');
        setHighlightIdx(-1);
      }
    } finally {
      setIaLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!puedeEditar) return;
    const t = setTimeout(() => cargarVariantes(search, labFilter, medicamentos), 350);
    return () => clearTimeout(t);
  }, [search, labFilter, medicamentos, cargarVariantes, puedeEditar]);

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function elegirVariante(v) {
    const lab = v.laboratorio || labFilter || '';
    setSeleccion(v);
    setSearch(v.nombre);
    setForm({
      nombre: v.nombre,
      laboratorio: lab,
      stock: '',
      lote: '',
      vencimiento: hoyMasMeses(12),
      rSanitario: '',
      costoUnit: v.medicamento?.costoUnit != null ? String(v.medicamento.costoUnit) : '',
      precioVenta: v.medicamento?.precioVenta != null ? String(v.medicamento.precioVenta) : '',
    });
    setDropdownOpen(false);
    setHighlightIdx(-1);
    setMsgOk('');
    setMsgErr('');
  }

  function limpiarBusqueda() {
    setSearch('');
    setLabFilter('');
    setDropdownOpen(false);
    setHighlightIdx(-1);
    limpiarSeleccion();
    inputRef.current?.focus();
  }

  function limpiarSeleccion() {
    setSeleccion(null);
    setMsgOk('');
    setMsgErr('');
  }

  function onKeyDownBusqueda(e) {
    if (!dropdownOpen || !search.trim()) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx(i => Math.min(i + 1, variantes.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && highlightIdx >= 0 && variantes[highlightIdx]) {
      e.preventDefault();
      elegirVariante(variantes[highlightIdx]);
    } else if (e.key === 'Escape') {
      setDropdownOpen(false);
    }
  }

  async function registrarMedicamento(e) {
    e.preventDefault();
    setMsgOk('');
    setMsgErr('');

    const nombre = form.nombre.trim();
    const laboratorio = form.laboratorio.trim();
    const lote = form.lote.trim();
    const stock = parseInt(form.stock, 10);
    const costoUnit = parseFloat(form.costoUnit);
    const precioVenta = form.precioVenta === '' ? 0 : parseFloat(form.precioVenta);

    if (!nombre) return setMsgErr('Ingrese el nombre del medicamento.');
    if (!laboratorio) return setMsgErr('Seleccione un laboratorio en el filtro o elija una variante del inventario.');
    if (!lote) return setMsgErr('Ingrese el número de lote.');
    if (!Number.isFinite(stock) || stock < 0) return setMsgErr('Ingrese un stock válido.');
    if (!form.vencimiento) return setMsgErr('Ingrese la fecha de vencimiento.');
    if (!Number.isFinite(costoUnit) || costoUnit < 0) return setMsgErr('Ingrese el precio de costo.');

    const payload = {
      nombre,
      laboratorio,
      lote,
      stock,
      stockMin: Math.max(1, Math.floor(stock / 10)),
      costoUnit,
      precioVenta: Number.isFinite(precioVenta) ? precioVenta : 0,
      vencimiento: form.vencimiento,
      rSanitario: form.rSanitario.trim() || null,
      categoria: seleccion?.categoria || 'General',
    };

    setGuardando(true);
    try {
      if (seleccion?.medicamentoId) {
        await api.registrarLote(seleccion.medicamentoId, { ...payload, role: user.role, usuario: user.name });
        setMsgOk('Lote registrado correctamente en el inventario.');
      } else {
        await api.createMedicamento({
          codigo: `FARM-${Date.now()}`,
          ...payload,
          role: user.role,
          usuario: user.name,
        });
        setMsgOk('Medicamento registrado correctamente en la base de datos.');
      }
      await recargar();
      limpiarSeleccion();
      setSearch('');
      setLabFilter('');
    } catch (err) {
      setMsgErr(err.message);
    } finally {
      setGuardando(false);
    }
  }

  if (loading) return <Loader />;

  const mostrarLista = dropdownOpen && search.trim().length > 0;
  const motor = etiquetaMotor(motorIA);

  // Obtener todos los laboratorios para el filtro general
  const laboratoriosDisponibles = [...new Set(medicamentos.map(m => m.laboratorio).filter(Boolean))].sort();

  // Filtrado para la tabla de inventario general
  const medicamentosFiltrados = medicamentos.filter(m => {
    const coincideTexto = coincideMedicamento(m, search);
    const coincideLab = filtroLaboratorioPrincipal ? m.laboratorio === filtroLaboratorioPrincipal : true;
    return coincideTexto && coincideLab;
  });



  return (
    <>
      <div className="section-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Gestión de Medicamentos</h1>
          <p className="page-subtitle">Búsqueda inteligente y registro de medicamentos con IA</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: 4 }}>
          {puedeEditar && (
            <button className="btn btn-primary" onClick={onNuevo}>
              <Plus size={18} /> Nuevo Medicamento
            </button>
          )}
        </div>
      </div>

      {puedeEditar && (
      <div className="ai-card">
        <div className="ai-card-title">
          <Sparkles size={18} />
          Búsqueda Inteligente con IA (Gemini)
        </div>
        <p className="ai-card-desc">
          Escriba el nombre del medicamento. Elija una presentación del listado y complete el registro.
        </p>

        <div className="ia-search-toolbar" ref={wrapRef}>
          <div className={`ia-combobox-wrap${dropdownOpen && search.trim() ? ' ia-combobox-open' : ''}`}>
            <label className="ia-field-label" htmlFor="ia-buscar-med">
              Buscar medicamento
            </label>
            <div className="ia-combobox-input-row">
              <Search className="ia-combobox-icon" size={18} />
              <input
                id="ia-buscar-med"
                ref={inputRef}
                type="text"
                className="ia-combobox-input"
                placeholder="Ej. Paracetamol, Ibuprofeno 400 mg…"
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setDropdownOpen(true);
                  if (seleccion) limpiarSeleccion();
                }}
                onFocus={() => search.trim() && setDropdownOpen(true)}
                onKeyDown={onKeyDownBusqueda}
                autoComplete="off"
                role="combobox"
                aria-expanded={mostrarLista}
                aria-autocomplete="list"
                aria-controls="ia-lista-sugerencias"
              />
              {search && (
                <button
                  type="button"
                  className="ia-combobox-clear"
                  onClick={limpiarBusqueda}
                  aria-label="Limpiar búsqueda"
                >
                  <X size={16} />
                </button>
              )}
              <ChevronDown
                size={18}
                className={`ia-combobox-chevron${dropdownOpen ? ' ia-chevron-up' : ''}`}
              />
            </div>

            {mostrarLista && (
              <div className="ia-combobox-panel" id="ia-lista-sugerencias" role="listbox">
                <div className="ia-combobox-panel-head">
                  <span>
                    {iaLoading ? 'Buscando…' : `${variantes.length} resultado(s)`}
                  </span>
                  {motor && !iaLoading && (
                    <span className={`ia-motor-badge ${motor.clase}`}>{motor.texto}</span>
                  )}
                </div>

                <ul className="ia-combobox-list">
                  {iaLoading && variantes.length === 0 && (
                    <li className="ia-combobox-empty">
                      <Loader2 size={20} className="ia-spin" />
                      <span>Consultando base de datos e IA…</span>
                    </li>
                  )}
                  {!iaLoading && variantes.length === 0 && (
                    <li className="ia-combobox-empty">
                      <Pill size={20} color="#94a3b8" />
                      <span>Sin coincidencias para &quot;{search.trim()}&quot;</span>
                    </li>
                  )}
                  {variantes.map((v, i) => (
                    <li key={`${v.nombre}-${i}`}>
                      <button
                        type="button"
                        className={`ia-combobox-option${highlightIdx === i ? ' ia-combobox-option-active' : ''}${seleccion?.nombre === v.nombre ? ' ia-combobox-option-selected' : ''}`}
                        role="option"
                        aria-selected={seleccion?.nombre === v.nombre}
                        onMouseEnter={() => setHighlightIdx(i)}
                        onClick={() => elegirVariante(v)}
                      >
                        <span className="ia-option-icon">
                          <Pill size={16} />
                        </span>
                        <span className="ia-option-body">
                          <span className="ia-combobox-nombre">{v.nombre}</span>
                          <span className="ia-option-meta">
                            {v.categoria && <span>{v.categoria}</span>}
                            {v.laboratorio && (
                              <>
                                <span className="ia-meta-dot">·</span>
                                <Building2 size={11} />
                                {v.laboratorio}
                              </>
                            )}
                          </span>
                        </span>
                        <span className="ia-option-badges">
                          {v.enInventario ? (
                            <span className="ia-combobox-tag ia-tag-inventario">
                              <Database size={10} /> Inventario
                            </span>
                          ) : (
                            <span className="ia-combobox-tag ia-tag-sugerencia">Sugerencia IA</span>
                          )}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="ia-combobox-panel-foot">
                  ↑ ↓ para navegar · Enter para seleccionar · Esc para cerrar
                </div>
              </div>
            )}
          </div>

          <div className="ia-lab-wrap">
            <label className="ia-field-label" htmlFor="ia-filtro-lab">
              Laboratorio
            </label>
            <div className="ia-lab-select-row">
              <Building2 size={16} className="ia-lab-icon" />
              <select
                id="ia-filtro-lab"
                className="ia-lab-filter"
                value={labFilter}
                onChange={e => {
                  setLabFilter(e.target.value);
                  if (seleccion) limpiarSeleccion();
                  setDropdownOpen(true);
                }}
                disabled={!search.trim()}
                title="Laboratorios de medicamentos que coinciden con la búsqueda"
              >
                <option value="">Todos los laboratorios</option>
                {labsBusqueda.map(l => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {seleccion && (
          <div className="ia-selection-chip">
            <CheckCircle2 size={16} />
            <span>
              Seleccionado: <strong>{seleccion.nombre}</strong>
              {seleccion.laboratorio && ` · ${seleccion.laboratorio}`}
            </span>
            <button type="button" onClick={limpiarSeleccion} aria-label="Quitar selección">
              <X size={14} />
            </button>
          </div>
        )}

        {iaError && (
          <div className="ai-tip ai-tip-error">
            <span>⚠️</span>
            <span>{iaError}</span>
          </div>
        )}
      </div>
      )}

      <div className="card" style={{ marginTop: '24px', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {!puedeEditar && (
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Search size={16} color="#64748b" />
                <label style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Buscar en inventario</label>
              </div>
              <input
                type="text"
                className="form-input"
                placeholder="Ej. Paracetamol, Ibuprofeno..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          )}

          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Filter size={16} color="#64748b" />
              <label style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Filtrar por Laboratorio</label>
            </div>
            <select
              className="filter-select ia-lab-filter"
              value={filtroLaboratorioPrincipal}
              onChange={(e) => setFiltroLaboratorioPrincipal(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">Todos los laboratorios</option>
              {laboratoriosDisponibles.map(lab => (
                <option key={lab} value={lab}>{lab}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {seleccion && (
        <div className="card ia-registro-panel ia-registro-panel-enter">
          <div className="ia-registro-header">
            <h2 className="ia-registro-titulo">Registrar medicamento</h2>
            <span className={`ia-registro-modo${seleccion.medicamentoId ? ' ia-modo-lote' : ' ia-modo-nuevo'}`}>
              {seleccion.medicamentoId ? 'Nuevo lote en inventario' : 'Alta nueva'}
            </span>
          </div>
          <form onSubmit={registrarMedicamento} className="ia-registro-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Nombre del medicamento</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Laboratorio</label>
                <input type="text" className="input-readonly" value={form.laboratorio} disabled />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Número de lote</label>
                <input
                  type="text"
                  value={form.lote}
                  onChange={e => setForm(f => ({ ...f, lote: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Fecha de vencimiento</label>
                <input
                  type="date"
                  value={form.vencimiento}
                  onChange={e => setForm(f => ({ ...f, vencimiento: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  R.S. <span className="label-optional">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={form.rSanitario}
                  onChange={e => setForm(f => ({ ...f, rSanitario: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Precio costo por medicamento</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.costoUnit}
                  onChange={e => setForm(f => ({ ...f, costoUnit: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  Precio venta <span className="label-optional">(opcional)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.precioVenta}
                  onChange={e => setForm(f => ({ ...f, precioVenta: e.target.value }))}
                />
              </div>
            </div>

            {msgErr && <p className="form-error">{msgErr}</p>}
            {msgOk && <p className="form-success">{msgOk}</p>}

            <div className="ia-registro-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={limpiarSeleccion}
                disabled={guardando}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={guardando}>
                {guardando ? 'Guardando…' : 'Registrar Medicamento'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Título y Tabla Principal del Inventario */}
      <div className="section-header" style={{ marginTop: '2rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="section-title">Inventario General</h2>
        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500', backgroundColor: '#f1f5f9', padding: '4px 12px', borderRadius: '99px' }}>
          Mostrando <strong>{medicamentosFiltrados.length}</strong> de {medicamentos.length} medicamentos
        </span>
      </div>

      <div className="table-container">
        {medicamentosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            <Box size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            {search.trim() ? 'No se encontraron medicamentos con ese criterio de búsqueda.' : 'No hay medicamentos registrados en el sistema.'}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Laboratorio</th>
                <th>Lote</th>
                <th>Stock</th>
                <th>Vencimiento</th>
                <th>Estado</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medicamentosFiltrados.map((m) => {
                const stock = m.stock || 0;
                const stockMin = m.stockMin || 10;
                const isCritico = stock === 0;
                const isBajo = stock > 0 && stock <= stockMin;
                const estadoClase = isCritico ? 'status-critical' : isBajo ? 'status-warning' : 'status-normal';
                const estadoTexto = isCritico ? 'Crítico' : isBajo ? 'Bajo' : 'Normal';

                return (
                  <tr key={m.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>{m.nombre}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{m.categoria || 'General'}</div>
                    </td>
                    <td>{m.laboratorio || 'N/A'}</td>
                    <td style={{ fontFamily: 'monospace', color: '#64748b' }}>{m.lote || '-'}</td>
                    <td>
                      <div style={{ fontWeight: isCritico ? 'bold' : 'normal', color: isCritico ? '#ef4444' : 'inherit' }}>
                        {stock}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Min: {stockMin}</div>
                    </td>
                    <td>
                      {m.vencimiento ? new Date(m.vencimiento).toLocaleDateString() : '-'}
                    </td>
                    <td>
                      <span className={`status-badge ${estadoClase}`}>
                        {estadoTexto}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button 
                          className="btn-icon" 
                          title="Consultar detalles y precio" 
                          onClick={() => setMedicamentoDetalle(m)}
                          style={{ color: '#3b82f6', background: '#eff6ff', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <Eye size={18} />
                        </button>
                        {puedeEditar && (
                          <button 
                            className="btn-icon" 
                            title="Editar medicamento" 
                            onClick={() => setMedicamentoEditar(m)}
                            style={{ color: '#f59e0b', background: '#fffbeb', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                          >
                            <Edit2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Detalle */}
      <ModalDetalleMedicamento 
        medicamento={medicamentoDetalle} 
        onClose={() => setMedicamentoDetalle(null)} 
      />

      {/* Modal de Edición */}
      <ModalEditarMedicamento
        medicamento={medicamentoEditar}
        onClose={() => setMedicamentoEditar(null)}
        onUpdated={() => {
          recargar();
          setMedicamentoEditar(null);
          setToastMsg('¡Medicamento guardado exitosamente!');
          setTimeout(() => setToastMsg(''), 3000);
        }}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          background: '#10b981', color: '#fff', padding: '16px 24px',
          borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
          zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px',
          fontWeight: '500', transition: 'all 0.3s ease-in-out'
        }}>
          <CheckCircle2 size={20} />
          {toastMsg}
        </div>
      )}
    </>
  );
}
