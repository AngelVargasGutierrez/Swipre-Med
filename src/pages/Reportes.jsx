import { useState, useEffect } from 'react';
import { FileText, TrendingUp, RotateCcw, Download } from 'lucide-react';
import { api } from '../services/api';
import Loader from '../components/Loader';
import * as XLSX from 'xlsx';

const TIPOS = [
  { key:'general',    label:'Reporte General',    icon:FileText,   desc:'Inventario completo con filtros'  },
  { key:'movimientos',label:'Ingresos y Salidas',  icon:TrendingUp, desc:'Movimientos de medicamentos'     },
  { key:'rotacion',   label:'Mayor Rotación',      icon:RotateCcw,  desc:'Medicamentos más dispensados'    },
];

export default function Reportes() {
  const [tipo,       setTipo]       = useState('general');
  const [fechaDesde, setFechaDesde] = useState('2026-04-01');
  const [fechaHasta, setFechaHasta] = useState('2026-04-15');
  const [resumen,    setResumen]    = useState(null);
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([api.getReporteResumen(), api.getMedicamentos()])
      .then(([res, meds]) => { setResumen(res); setMedicamentos(meds); })
      .finally(() => setLoading(false));
  }, []);

  const handleExportExcel = () => {
    if (!medicamentos || medicamentos.length === 0) return;

    // Preparamos los datos para Excel
    const dataToExport = medicamentos.map(m => ({
      'Código': m.codigo,
      'Medicamento': m.nombre,
      'Categoría': m.categoria || 'General',
      'Laboratorio': m.laboratorio || 'N/A',
      'Lote': m.lote || '-',
      'Stock Actual': m.stock,
      'Stock Mínimo': m.stockMin || 10,
      'Estado Stock': m.estado,
      'Costo Unitario ($)': m.costoUnit,
      'Precio Venta ($)': m.precioVenta,
      'Valor Inventario ($)': (m.stock * m.costoUnit).toFixed(2),
      'Vencimiento': m.vencimiento ? new Date(m.vencimiento).toLocaleDateString() : 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
    
    // Auto-ajustar ancho de columnas
    const colWidths = [
      { wch: 15 }, { wch: 30 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, 
      { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 18 }, { wch: 18 }, 
      { wch: 20 }, { wch: 15 }
    ];
    worksheet['!cols'] = colWidths;

    // Generar buffer en vez de archivo directo para evitar bug de navegadores sin extensión
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    
    // Crear link virtual para forzar la descarga con nombre y extensión específica
    const filename = `Reporte_MOPGIMED_${fechaDesde}_al_${fechaHasta}.xlsx`;
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    // Limpiar DOM
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <Loader />;

  return (
    <>
      <h1 className="page-title">Reportes</h1>
      <p className="page-subtitle">Generación y exportación de reportes del inventario</p>

      {/* ── Report type selector ────────────────────── */}
      <div className="card" style={{ marginBottom:20 }}>
        <div className="form-section-title" style={{ borderBottom:'none', paddingBottom:0, marginBottom:16 }}>
          Tipo de Reporte
        </div>
        <div className="report-type-grid">
          {TIPOS.map(t => {
            const Icon = t.icon;
            return (
              <div
                key={t.key}
                className={`report-type-card${tipo === t.key ? ' selected' : ''}`}
                onClick={() => setTipo(t.key)}
              >
                <div className="report-type-icon">
                  <Icon size={22} color={tipo === t.key ? '#2563eb' : '#64748b'} />
                </div>
                <div className="report-type-title">{t.label}</div>
                <div className="report-type-desc">{t.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Date filters ────────────────────────────── */}
      <div className="card" style={{ marginBottom:20 }}>
        <div className="form-section-title" style={{ borderBottom:'none', paddingBottom:0, marginBottom:16 }}>
          Filtros de Fecha
        </div>
        <div style={{ display:'flex', gap:16, alignItems:'flex-end', flexWrap:'wrap' }}>
          <div className="form-group" style={{ marginBottom:0 }}>
            <label className="form-label">Fecha Desde</label>
            <input
              className="form-input"
              type="date"
              value={fechaDesde}
              onChange={e => setFechaDesde(e.target.value)}
              style={{ width:'auto' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom:0 }}>
            <label className="form-label">Fecha Hasta</label>
            <input
              className="form-input"
              type="date"
              value={fechaHasta}
              onChange={e => setFechaHasta(e.target.value)}
              style={{ width:'auto' }}
            />
          </div>
          <button className="btn btn-green" style={{ marginBottom:0 }} onClick={handleExportExcel}>
            <Download size={16} /> Exportar a Excel
          </button>
        </div>
      </div>

      {/* ── Report content ───────────────────────────── */}
      {tipo === 'general' && resumen && (
        <div className="card">
          <div className="form-section-title" style={{ borderBottom:'2px solid #f1f5f9', paddingBottom:12 }}>
            Reporte General de Inventario
            <span style={{ fontSize:12, fontWeight:400, color:'#94a3b8', marginLeft:12 }}>
              Período: {fechaDesde.split('-').reverse().join('/')} - {fechaHasta.split('-').reverse().join('/')}
            </span>
          </div>

          {/* Summary row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
            {[
              { label:'Total Medicamentos', value: resumen.totalProductos,                  color:'#b91c1c' },
              { label:'Valor Inventario',   value:`$${parseFloat(resumen.valorInventario).toFixed(2)}`, color:'#059669' },
              { label:'Valor de Venta',     value:`$${parseFloat(resumen.valorVenta).toFixed(2)}`,      color:'#d97706' },
              { label:'Ganancia Estimada',  value:`$${parseFloat(resumen.gananciaEstimada).toFixed(2)}`,color:'#7c3aed' },
            ].map(s => (
              <div key={s.label} style={{
                background:'linear-gradient(135deg,#f8faff,#eff6ff)',
                borderRadius:12, padding:16, textAlign:'center',
                border:'1px solid #dbeafe',
              }}>
                <div style={{ fontSize:22, fontWeight:900, color:s.color }}>{s.value}</div>
                <div style={{ fontSize:12, color:'#64748b', marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Medicamento</th>
                  <th>Laboratorio</th>
                  <th>Lote</th>
                  <th>Stock</th>
                  <th>Costo Unit.</th>
                  <th>P. Venta</th>
                  <th>Valor Inv.</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {medicamentos.map(m => (
                  <tr key={m.id}>
                    <td style={{ fontFamily:'monospace', fontSize:11 }}>{m.codigo}</td>
                    <td>
                      <div style={{ fontWeight:700 }}>{m.nombre}</div>
                      <div style={{ fontSize:11, color:'#94a3b8' }}>{m.categoria}</div>
                    </td>
                    <td style={{ fontSize:12 }}>{m.laboratorio}</td>
                    <td style={{ fontFamily:'monospace', fontSize:11 }}>{m.lote}</td>
                    <td style={{ fontWeight:700 }}>{m.stock}</td>
                    <td>${m.costoUnit.toFixed(2)}</td>
                    <td>${m.precioVenta.toFixed(2)}</td>
                    <td style={{ fontWeight:700, color:'#b91c1c' }}>${(m.stock * m.costoUnit).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${m.estado==='Normal'?'green':m.estado==='Bajo'?'yellow':'red'}`}>
                        {m.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tipo === 'movimientos' && (
        <div className="card">
          <div className="form-section-title">Reporte de Ingresos y Salidas</div>
          <p style={{ color:'#64748b', fontSize:14 }}>
            Este reporte muestra los movimientos de medicamentos (entradas y salidas) en el período seleccionado.
            Conecte con el módulo de ventas para obtener data histórica real.
          </p>
        </div>
      )}

      {tipo === 'rotacion' && (
        <div className="card">
          <div className="form-section-title">Reporte de Mayor Rotación</div>
          <p style={{ color:'#64748b', fontSize:14 }}>
            Este reporte muestra los medicamentos con mayor número de dispensaciones en el período seleccionado.
            Conecte con el módulo de ventas para obtener data histórica real.
          </p>
        </div>
      )}
    </>
  );
}
