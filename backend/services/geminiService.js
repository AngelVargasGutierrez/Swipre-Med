/**
 * Sugerencias farmacéuticas vía Google Gemini API.
 * Requiere GEMINI_API_KEY en backend/.env
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 6000;

async function fetchGemini(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Gemini no respondió en ${GEMINI_TIMEOUT_MS / 1000}s`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

function parseJsonArray(text) {
  const raw = (text || '').trim();
  const jsonBlock = raw.match(/\[[\s\S]*\]/);
  const toParse = jsonBlock ? jsonBlock[0] : raw;
  const parsed = JSON.parse(toParse);
  if (!Array.isArray(parsed)) throw new Error('La respuesta no es un arreglo JSON');
  return parsed;
}

async function generarSugerenciasFarmaceuticas(query) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no está configurada en backend/.env');
  }

  const q = String(query || '').trim();
  if (q.length < 2) return [];

  const prompt = `Eres un farmacéutico experto. El usuario busca medicamentos con el texto: "${q}".

Devuelve ÚNICAMENTE un arreglo JSON válido (máximo 6 objetos) con nombres estandarizados de medicamentos (principio activo, concentración y forma si aplica).
Cada objeto debe tener exactamente estas claves:
- "nombre" (string, nombre completo estandarizado en español)
- "categoria" (string, categoría terapéutica)
- "fuente" (string, siempre "Gemini IA")

No uses markdown. No agregues texto fuera del JSON. Ejemplo de formato:
[{"nombre":"Paracetamol 500 mg Tableta","categoria":"Analgésicos","fuente":"Gemini IA"}]`;

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetchGemini(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
      },
    }),
  });

  const body = await response.json();

  if (!response.ok) {
    const msg = body?.error?.message || `Gemini HTTP ${response.status}`;
    throw new Error(msg);
  }

  const text =
    body?.candidates?.[0]?.content?.parts?.[0]?.text ||
    body?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') ||
    '';

  if (!text) throw new Error('Gemini no devolvió contenido');

  const items = parseJsonArray(text)
    .filter(x => x && typeof x.nombre === 'string')
    .map(x => ({
      nombre: x.nombre.trim(),
      categoria: (x.categoria || 'General').trim(),
      fuente: 'Gemini IA',
    }))
    .slice(0, 6);

  return items;
}

async function generarVariantesFarmaceuticas(nombreBase) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no está configurada en backend/.env');
  }

  const base = String(nombreBase || '').trim();
  if (base.length < 1) return [];

  const prompt = `Eres un farmacéutico experto. El usuario escribe en un buscador letra por letra: "${base}".

Devuelve ÚNICAMENTE un arreglo JSON (máximo 10 objetos) con modelos/presentaciones farmacéuticas DISTINTAS y SIN REPETIR que:
- correspondan al principio activo o nombre comercial que el usuario está escribiendo, o
- contengan "${base}" en el nombre del medicamento.

Cada "nombre" debe ser el nombre completo de la opción en el listado, incluyendo concentración y forma farmacéutica (tableta, cápsula, jarabe, solución, suspensión, gotas, inyectable, etc.).
Ejemplos: "Paracetamol 500 mg Tableta", "Paracetamol Jarabe 120 mg/5 mL", "Ibuprofeno 400 mg Cápsula".

Cada objeto:
- "nombre" (string, nombre descriptivo único para mostrar en un combobox)
- "categoria" (string)
- "presentacion" (string, forma y concentración resumida)
- "fuente" (string, "Gemini IA")

Solo JSON, sin markdown.`;

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetchGemini(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 1536,
        responseMimeType: 'application/json',
      },
    }),
  });

  const body = await response.json();
  if (!response.ok) {
    const msg = body?.error?.message || `Gemini HTTP ${response.status}`;
    throw new Error(msg);
  }

  const text =
    body?.candidates?.[0]?.content?.parts?.[0]?.text ||
    body?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') ||
    '';

  if (!text) throw new Error('Gemini no devolvió variantes');

  return parseJsonArray(text)
    .filter(x => x && typeof x.nombre === 'string')
    .map(x => ({
      nombre: x.nombre.trim(),
      categoria: (x.categoria || 'General').trim(),
      presentacion: (x.presentacion || x.nombre).trim(),
      fuente: 'Gemini IA',
    }))
    .slice(0, 8);
}

module.exports = { generarSugerenciasFarmaceuticas, generarVariantesFarmaceuticas };
