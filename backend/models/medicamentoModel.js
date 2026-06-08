const pool = require('../db/connection');

function fmtFecha(dateVal) {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  return `${String(d.getUTCDate()).padStart(2,'0')}/${String(d.getUTCMonth()+1).padStart(2,'0')}/${d.getUTCFullYear()}`;
}

function mapRow(m) {
  return {
    id:          m.id,
    codigo:      m.codigo,
    nombre:      m.nombre,
    laboratorio: m.laboratorio,
    lote:        m.lote,
    stock:       m.stock,
    stockMin:    m.stock_min,
    costoUnit:   parseFloat(m.costo_unit),
    precioVenta: parseFloat(m.precio_venta),
    vencimiento: fmtFecha(m.vencimiento),
    rSanitario:  m.r_sanitario,
    estado:      m.estado,
    categoria:   m.categoria,
  };
}

function calcEstado(stock, stockMin) {
  if (stock <= stockMin * 0.5) return 'Crítico';
  if (stock < stockMin)        return 'Bajo';
  return 'Normal';
}

async function findAll() {
  const [rows] = await pool.execute('SELECT * FROM medicamentos ORDER BY nombre');
  return rows.map(mapRow);
}

async function findById(id) {
  const [rows] = await pool.execute('SELECT * FROM medicamentos WHERE id = ?', [id]);
  return rows[0] ? mapRow(rows[0]) : null;
}

async function create(data) {
  const { codigo, nombre, laboratorio, lote, stock, stockMin, costoUnit, precioVenta, vencimiento, rSanitario, categoria } = data;
  const stockNum = parseInt(stock) || 0;
  const minNum   = parseInt(stockMin) || 0;
  const estado   = calcEstado(stockNum, minNum);
  const vencDB   = vencimiento ? vencimiento.split('/').reverse().join('-') : null;

  const [result] = await pool.execute(
    `INSERT INTO medicamentos (codigo,nombre,laboratorio,lote,stock,stock_min,costo_unit,precio_venta,vencimiento,r_sanitario,estado,categoria)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [codigo, nombre, laboratorio, lote, stockNum, minNum, costoUnit||0, precioVenta||0, vencDB, rSanitario, estado, categoria]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const { nombre, laboratorio, lote, stock, stockMin, costoUnit, precioVenta, vencimiento, rSanitario, categoria } = data;
  const stockNum = parseInt(stock) || 0;
  const minNum   = parseInt(stockMin) || 0;
  const estado   = calcEstado(stockNum, minNum);
  const vencDB   = vencimiento ? vencimiento.split('/').reverse().join('-') : null;

  await pool.execute(
    `UPDATE medicamentos SET nombre=?,laboratorio=?,lote=?,stock=?,stock_min=?,costo_unit=?,precio_venta=?,vencimiento=?,r_sanitario=?,estado=?,categoria=? WHERE id=?`,
    [nombre, laboratorio, lote, stockNum, minNum, costoUnit||0, precioVenta||0, vencDB, rSanitario, estado, categoria, id]
  );
  return findById(id);
}

async function remove(id) {
  await pool.execute('DELETE FROM medicamentos WHERE id = ?', [id]);
}

async function getLaboratorios() {
  const [rows] = await pool.execute(
    'SELECT DISTINCT laboratorio FROM medicamentos WHERE laboratorio IS NOT NULL ORDER BY laboratorio'
  );
  return rows.map(r => r.laboratorio);
}

async function getCategorias() {
  const [rows] = await pool.execute(
    'SELECT DISTINCT categoria FROM medicamentos WHERE categoria IS NOT NULL ORDER BY categoria'
  );
  return rows.map(r => r.categoria);
}

async function registrarLote(id, data) {
  const { lote, costoUnit, precioVenta, stockMin, stockInicial, vencimiento, rSanitario } = data;
  const existing = await findById(id);
  if (!existing) throw new Error('Medicamento no encontrado');

  const newStock  = (parseInt(existing.stock) || 0) + (parseInt(stockInicial) || 0);
  const minNum    = parseInt(stockMin) || parseInt(existing.stockMin) || 0;
  const estado    = calcEstado(newStock, minNum);
  const vencDB    = vencimiento ? vencimiento.split('/').reverse().join('-') : null;

  await pool.execute(
    `UPDATE medicamentos
       SET lote=?, stock=?, stock_min=?, costo_unit=?, precio_venta=?,
           vencimiento=?, r_sanitario=?, estado=?
     WHERE id=?`,
    [
      lote || existing.lote,
      newStock,
      minNum,
      costoUnit  !== undefined ? costoUnit  : existing.costoUnit,
      precioVenta !== undefined ? precioVenta : existing.precioVenta,
      vencDB,
      rSanitario || existing.rSanitario,
      estado,
      id,
    ]
  );
  return findById(id);
}

module.exports = { findAll, findById, create, update, remove, getLaboratorios, getCategorias, registrarLote };
