const pool = require('../db/connection');

async function getPrediccionDemanda() {
  const [rows] = await pool.execute(
    'SELECT mes, real_val AS `real`, prediccion FROM prediccion_demanda ORDER BY id'
  );
  return rows.map(r => ({ ...r, real: r.real ?? null, prediccion: r.prediccion ?? null }));
}

async function getComparativaMensual() {
  const [rows] = await pool.execute(
    'SELECT mes, ventas, compras FROM comparativa_mensual ORDER BY id'
  );
  return rows;
}

async function getTendencias() {
  const [rows] = await pool.execute(
    'SELECT categoria, cambio, positivo FROM tendencias ORDER BY id'
  );
  return rows.map(r => ({ ...r, positivo: !!r.positivo }));
}

async function getPrediccionesCriticas() {
  const [rows] = await pool.execute(
    'SELECT nombre, stock_actual AS stockActual, fecha_predicha AS fechaPredicha, ordenar, prioridad FROM predicciones_criticas ORDER BY ordenar DESC'
  );
  return rows;
}

async function getValorPorCategoria() {
  const [rows] = await pool.execute(`
    SELECT categoria,
      SUM(stock * costo_unit)   AS valor_costo,
      SUM(stock * precio_venta) AS valor_venta
    FROM medicamentos GROUP BY categoria ORDER BY valor_venta DESC
  `);
  return rows.map(r => ({
    categoria:  r.categoria,
    valorCosto: parseFloat(r.valor_costo),
    valorVenta: parseFloat(r.valor_venta),
  }));
}

module.exports = { getPrediccionDemanda, getComparativaMensual, getTendencias, getPrediccionesCriticas, getValorPorCategoria };
