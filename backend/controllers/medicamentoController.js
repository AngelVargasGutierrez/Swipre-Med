const medicamentoModel = require('../models/medicamentoModel');
const reporteModel    = require('../models/reporteModel');
const geminiService   = require('../services/geminiService');
const catalogoFallback = require('../data/catalogoFallback');

const norm = (s) => (s || '').trim().toLowerCase();

function filtrarInventario(medicamentos, query, sugerenciasIA = []) {
  const q = norm(query);
  if (!q) return medicamentos;

  const terminos = new Set([q]);
  for (const s of sugerenciasIA) {
    const n = norm(s.nombre);
    if (n) terminos.add(n);
    n.split(/\s+/).slice(0, 2).forEach(p => { if (p.length > 2) terminos.add(p); });
  }

  return medicamentos.filter(m => {
    const campos = [
      norm(m.nombre),
      norm(m.codigo),
      norm(m.laboratorio),
      norm(m.categoria),
    ];
    for (const t of terminos) {
      if (campos.some(c => c.includes(t) || t.includes(c.split(' ')[0]))) return true;
    }
    return false;
  });
}

async function getAll(req, res) {
  try {
    res.json(await medicamentoModel.findAll());
  } catch (err) { res.status(500).json({ error: err.message }); }
}

async function getOne(req, res) {
  try {
    const med = await medicamentoModel.findById(req.params.id);
    if (!med) return res.status(404).json({ error: 'No encontrado' });
    res.json(med);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

async function create(req, res) {
  try {
    const nuevo = await medicamentoModel.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

async function update(req, res) {
  try {
    const actualizado = await medicamentoModel.update(req.params.id, req.body);
    res.json(actualizado);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

async function remove(req, res) {
  try {
    await medicamentoModel.remove(req.params.id);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
}

async function getLaboratorios(req, res) {
  try {
    res.json(await medicamentoModel.getLaboratorios());
  } catch (err) { res.status(500).json({ error: err.message }); }
}

async function getCategorias(req, res) {
  try {
    res.json(await medicamentoModel.getCategorias());
  } catch (err) { res.status(500).json({ error: err.message }); }
}

async function getSugerenciasIA(req, res) {
  try {
    const q = (req.query.q || '').trim();
    if (q.length < 2) return res.json([]);

    const sugerencias = await geminiService.generarSugerenciasFarmaceuticas(q);
    res.json(sugerencias);
  } catch (err) {
    console.error('[Gemini sugerencias-ia]', err.message);
    const fallback = catalogoFallback.buscarLocal(q, 6);
    if (fallback.length) return res.json(fallback);
    res.status(502).json({
      error: 'Gemini no disponible. Revise cuota o GEMINI_API_KEY en backend/.env',
      detalle: err.message,
    });
  }
}

function palabraBase(texto) {
  const m = String(texto || '').trim().toLowerCase().match(/^[a-záéíóúñ]+/i);
  return m ? m[0].toLowerCase() : String(texto || '').trim().toLowerCase().split(/\s+/)[0];
}

function coincideBusquedaMed(m, base) {
  const q = norm(base);
  if (!q) return true;
  const palabra = palabraBase(base);
  const campos = [norm(m.nombre), norm(m.codigo), norm(m.laboratorio), norm(m.categoria)];
  return campos.some(c => c.includes(q) || (palabra.length >= 2 && c.includes(palabra)));
}

function laboratoriosDeBusqueda(inventario, base) {
  const labSet = new Set();
  for (const m of inventario) {
    if (!coincideBusquedaMed(m, base)) continue;
    if (m.laboratorio) labSet.add(m.laboratorio);
  }
  return [...labSet].sort();
}

function variantesDesdeInventario(inventario, base, lab) {
  const items = [];
  const seen = new Set();
  for (const m of inventario) {
    if (!coincideBusquedaMed(m, base)) continue;
    if (lab && norm(m.laboratorio) !== norm(lab)) continue;
    const key = norm(m.nombre);
    if (seen.has(key)) continue;
    seen.add(key);
    items.push(vincularVarianteConInventario(
      { nombre: m.nombre, categoria: m.categoria, presentacion: m.nombre, fuente: 'Base de datos' },
      inventario
    ));
  }
  return items;
}

function fusionarVariantes(primero, segundo, max = 12) {
  const out = [];
  const seen = new Set();
  for (const v of [...primero, ...segundo]) {
    const key = norm(v.nombre);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(v);
    if (out.length >= max) break;
  }
  return out;
}

function vincularVarianteConInventario(variante, inventario) {
  const vn = norm(variante.nombre);
  const match = inventario.find(m => {
    const mn = norm(m.nombre);
    return vn === mn || mn.includes(vn) || vn.includes(mn);
  });

  return {
    nombre: variante.nombre,
    categoria: variante.categoria || match?.categoria || 'General',
    presentacion: variante.presentacion || variante.nombre,
    fuente: variante.fuente || 'Gemini IA',
    enInventario: !!match,
    medicamentoId: match?.id ?? null,
    codigo: match?.codigo ?? null,
    laboratorio: match?.laboratorio ?? null,
    stockActual: match?.stock ?? null,
    medicamento: match || null,
  };
}

function combinarVariantes(geminiList, fallbackList, inventario, base) {
  const palabra = palabraBase(base);
  const items = [];
  const seen = new Set();

  for (const v of [...geminiList, ...fallbackList]) {
    const key = norm(v.nombre);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    items.push(vincularVarianteConInventario(v, inventario));
  }

  for (const m of inventario) {
    if (!coincideBusquedaMed(m, base)) continue;
    const key = norm(m.nombre);
    if (seen.has(key)) {
      const idx = items.findIndex(i => norm(i.nombre) === key);
      if (idx >= 0 && !items[idx].enInventario) {
        items[idx] = vincularVarianteConInventario(
          { nombre: m.nombre, categoria: m.categoria, presentacion: m.nombre, fuente: 'Inventario' },
          inventario
        );
      }
      continue;
    }
    seen.add(key);
    items.push(vincularVarianteConInventario(
      { nombre: m.nombre, categoria: m.categoria, presentacion: m.nombre, fuente: 'Inventario' },
      inventario
    ));
  }

  return items.slice(0, 12);
}

function filtrarVariantesPorLaboratorio(variantes, lab) {
  if (!lab) return variantes;
  const labN = norm(lab);
  return variantes.filter(v => {
    if (!v.laboratorio) return true;
    return norm(v.laboratorio) === labN;
  });
}

async function getVariantesIA(req, res) {
  try {
    const base = (req.query.base || req.query.q || '').trim();
    const lab = (req.query.laboratorio || '').trim();
    if (base.length < 1) return res.json({ nombreBase: base, variantes: [], laboratorios: [] });

    const inventario = await medicamentoModel.findAll();
    const laboratorios = laboratoriosDeBusqueda(inventario, base);
    const desdeBD = variantesDesdeInventario(inventario, base, lab);
    const fallbackList = catalogoFallback.buscarVariantes(base, 12);

    let geminiList = [];
    try {
      geminiList = await geminiService.generarVariantesFarmaceuticas(base);
    } catch (err) {
      console.error('[Gemini variantes-ia]', err.message);
    }

    let variantes = combinarVariantes(geminiList, fallbackList, inventario, base);
    variantes = filtrarVariantesPorLaboratorio(variantes, lab);
    variantes = fusionarVariantes(desdeBD, variantes, 12);

    let motor = 'base-de-datos';
    if (geminiList.length) motor = 'gemini';
    else if (desdeBD.length === 0 && variantes.length) motor = 'catalogo-local';

    res.json({
      nombreBase: base,
      variantes,
      laboratorios,
      motor,
      totalBD: desdeBD.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function buscarConIA(req, res) {
  try {
    const q = (req.query.q || '').trim();
    const lab = (req.query.laboratorio || '').trim();
    const todos = await medicamentoModel.findAll();

    if (q.length < 2) {
      const resultados = lab
        ? todos.filter(m => norm(m.laboratorio) === norm(lab))
        : todos;
      return res.json({ sugerenciasIA: [], resultados, motor: 'local' });
    }

    let sugerenciasIA = [];
    let motor = 'local';

    try {
      sugerenciasIA = await geminiService.generarSugerenciasFarmaceuticas(q);
      motor = 'gemini';
    } catch (err) {
      console.error('[Gemini buscar-ia]', err.message);
      sugerenciasIA = catalogoFallback.buscarLocal(q, 6);
      motor = sugerenciasIA.length ? 'catalogo-local' : 'local-fallback';
    }

    let resultados = filtrarInventario(todos, q, sugerenciasIA);
    if (lab) {
      resultados = resultados.filter(m => norm(m.laboratorio) === norm(lab));
    }

    res.json({ sugerenciasIA, resultados, motor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function registrarLote(req, res) {
  try {
    const { usuario, ...loteData } = req.body;
    const actualizado = await medicamentoModel.registrarLote(req.params.id, loteData);
    await reporteModel.registrarAccion(
      usuario || 'Sistema',
      'Registró nuevo lote',
      'Medicamentos',
      `Lote ${loteData.lote} de ${actualizado.nombre} (stock añadido: ${loteData.stockInicial})`
    );
    res.json(actualizado);
  } catch (err) {
    if (err.message === 'Medicamento no encontrado') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAll, getOne, create, update, remove, getLaboratorios, getCategorias,
  getSugerenciasIA, getVariantesIA, buscarConIA, registrarLote,
};
