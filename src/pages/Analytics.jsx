import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { api } from '../services/api';
import Loader from '../components/Loader';

export default function Analytics() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (!data)   return <p style={{ color:'#ef4444' }}>Error al cargar datos.</p>;

  const { prediccionDemanda, comparativaMensual, tendencias, prediccionesCriticas } = data;

  return (
    <>
      <h1 className="page-title">ANALÍTICAS</h1>
      <p className="page-subtitle">Predicciones y análisis avanzado impulsado por IA</p>

      {/* ── Insight cards ────────────────────────────── */}
      <div className="insight-grid">
        <div className="insight-card purple">
          <div className="insight-card-title">Insight del Día</div>
          <div className="insight-card-desc">
            Se detectó un aumento del 22% en la demanda de antiinflamatorios.
            Se recomienda incrementar el stock en un 15%.
          </div>
        </div>
        <div className="insight-card blue">
          <div className="insight-card-title">Tendencia General</div>
          <div className="insight-card-desc">
            El consumo general presenta una tendencia alcista del 8.5%
            comparado con el trimestre anterior.
          </div>
        </div>
      </div>

      {/* ── Charts row ───────────────────────────────── */}
      <div className="charts-grid">
        {/* Area chart – Predicción */}
        <div className="chart-card">
          <div className="chart-title" style={{ display:'flex', alignItems:'center', gap:8 }}>
            Predicción de Demanda (IA)
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={prediccionDemanda}>
              <defs>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#8b5cf6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" tick={{ fontSize:12 }} />
              <YAxis tick={{ fontSize:11 }} domain={[0, 600]} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone" dataKey="real" stroke="#b91c1c" strokeWidth={2.5}
                fill="none" dot={{ r:5, fill:'#b91c1c' }}
                name="real" connectNulls={false}
              />
              <Area
                type="monotone" dataKey="prediccion" stroke="#8b5cf6" strokeWidth={2.5}
                fill="url(#predGrad)" dot={{ r:5, fill:'#8b5cf6' }}
                name="prediccion" connectNulls={false} strokeDasharray="6 3"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Grouped bar – Comparativa */}
        <div className="chart-card">
          <div className="chart-title" style={{ display:'flex', alignItems:'center', gap:8 }}>
            Comparativa Mensual
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={comparativaMensual} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" tick={{ fontSize:11 }} />
              <YAxis tick={{ fontSize:11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventas"  fill="#10b981" radius={[4,4,0,0]} name="ventas"  />
              <Bar dataKey="compras" fill="#b91c1c" radius={[4,4,0,0]} name="compras" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Tendencias + Predicciones ─────────────────── */}
      <div className="bottom-grid" style={{ marginBottom:24 }}>
        {/* Tendencias */}
        <div className="chart-card">
          <div className="chart-title" style={{ display:'flex', alignItems:'center', gap:8 }}>
            Tendencias de Consumo
          </div>
          {tendencias.map(t => (
            <div key={t.categoria} className="tendency-row">
              <span>{t.categoria}</span>
              <div className={`tendency-change ${t.positivo ? 'pos' : 'neg'}`}>
                <strong>{t.positivo ? '+' : ''}{t.cambio}%</strong>
                {t.positivo ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              </div>
            </div>
          ))}
        </div>

        {/* Predicciones críticas */}
        <div className="chart-card">
          <div className="chart-title" style={{ display:'flex', alignItems:'center', gap:8 }}>
            Predicciones Críticas
          </div>
          {prediccionesCriticas.map((p, i) => (
            <div key={i} className={`pred-card ${p.prioridad === 'Alta' ? 'alta' : 'media'}`}>
              <div className="pred-card-header">
                <div className="pred-card-title">{p.nombre}</div>
                <span className={`badge ${p.prioridad === 'Alta' ? 'red' : 'yellow'}`}>
                  {p.prioridad}
                </span>
              </div>
              <div className="pred-card-info">Stock actual: <strong>{p.stockActual} unidades</strong></div>
              <div className="pred-card-info">Fecha predicha: {p.fechaPredicha}</div>
              <button className="pred-order-btn">
                Ordenar {p.ordenar} unidades
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recomendaciones IA ────────────────────────── */}
      <div className="chart-card" style={{ marginBottom:0 }}>
        <div className="chart-title" style={{ display:'flex', alignItems:'center', gap:8 }}>
          Recomendaciones IA
        </div>
        <div className="recommend-grid">
          <div className="recommend-card purple">
            <div style={{ fontSize:15, fontWeight:700, marginBottom:8 }}>Optimización de Stock</div>
            <div style={{ fontSize:13, color:'#64748b', lineHeight:1.6 }}>
              Reducir el pedido de Antibióticos en un 10% el próximo trimestre. La demanda ha caído un 8%
              y el stock actual cubre 4 meses.
            </div>
          </div>
          <div className="recommend-card blue">
            <div style={{ fontSize:15, fontWeight:700, marginBottom:8 }}>Ahorro de Costos</div>
            <div style={{ fontSize:13, color:'#64748b', lineHeight:1.6 }}>
              Renegociar contrato con GastroLab podría reducir costos un 12%. Compra promedio mensual
              supera S/ 3,200.
            </div>
          </div>
          <div className="recommend-card green">
            <div style={{ fontSize:15, fontWeight:700, marginBottom:8 }}>Patrón Detectado</div>
            <div style={{ fontSize:13, color:'#64748b', lineHeight:1.6 }}>
              La demanda de Antihistamínicos sube un 35% en marzo-abril. Preparar stock adicional
              para el próximo año.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
