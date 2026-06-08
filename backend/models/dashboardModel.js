const pool = require('../db/connection');

async function getStats() {
  const [[row]] = await pool.execute(`
    SELECT
      COUNT(*)                                                                  AS total_medicamentos,
      SUM(CASE WHEN estado='Crítico' THEN 1 ELSE 0 END)                        AS stock_critico,
      SUM(CASE WHEN estado='Bajo'    THEN 1 ELSE 0 END)                        AS stock_bajo,
      SUM(CASE WHEN vencimiento IS NOT NULL
               AND vencimiento <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) AS por_vencer,
      SUM(stock * costo_unit)                                                   AS valor_inventario
    FROM medicamentos
  `);
  return row;
}

async function getStockPorCategoria() {
  const [rows] = await pool.execute(
    'SELECT categoria, SUM(stock) AS stock FROM medicamentos GROUP BY categoria ORDER BY categoria'
  );
  return rows;
}

async function getEstadoStock() {
  const [rows] = await pool.execute(
    'SELECT estado, COUNT(*) AS total FROM medicamentos GROUP BY estado'
  );
  return rows;
}

async function getMovimientosSemana() {
  const [rows] = await pool.execute('SELECT dia, entradas, salidas FROM movimientos_semana');
  return rows;
}

async function getTop5Valor() {
  const [rows] = await pool.execute(
    'SELECT nombre, stock, precio_venta, (stock*precio_venta) AS valor FROM medicamentos ORDER BY valor DESC LIMIT 5'
  );
  return rows;
}

async function getAlertas() {
  const [rows] = await pool.execute(
    "SELECT titulo, descripcion, fecha, color FROM notificaciones WHERE leida = 0 AND prioridad = 'High' ORDER BY id DESC LIMIT 5"
  );
  return rows;
}

module.exports = { getStats, getStockPorCategoria, getEstadoStock, getMovimientosSemana, getTop5Valor, getAlertas };
