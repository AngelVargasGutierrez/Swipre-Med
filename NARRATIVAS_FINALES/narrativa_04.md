# UC-004 – Registrar Lote de Medicamento Existente

## a) UC-004 – Registrar Lote de Medicamento Existente

| Campo | Detalle |
|---|---|
| **Caso de uso** | UC-004 – Registrar Lote de Medicamento Existente |
| **Actores** | Personal de Farmacia, Almacenero, Administrador |
| **Propósito** | Permitir registrar un lote físico, fecha de vencimiento, costo unitario y stock inicial de un medicamento que ya existe en el catálogo. |
| **Tipo** | Obligatorio (X) / Opcional ( ) |
| **Requisito ID (RF)** | RF-004 |
| **Versión** | 1.0 |
| **Descripción** | El personal registra un nuevo lote físico de un medicamento ya catalogado. El sistema le asiste permitiendo buscar el medicamento existente para autocompletar su nombre, laboratorio y categoría, obligando al usuario a ingresar manualmente la información específica del nuevo lote físico (lote, fecha de vencimiento, costo unitario, precio de venta, stock mínimo y stock inicial). |
| **Precondición** | El usuario debe estar autenticado en el sistema y el medicamento debe existir previamente en el catálogo de la base de datos. |
| **Postcondición** | El lote del medicamento queda registrado con éxito, actualizando el stock disponible y recalculando su nivel de stock de acuerdo a las políticas de semáforo. |

---

### Curso normal de eventos

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal hace clic en el botón "Nuevo Medicamento" (+) ubicado en la parte superior derecha del listado principal de medicamentos. | |
| 2 | | El sistema carga la interfaz gráfica de **Registro Rápido de Medicamento**. En la parte superior, despliega el botón "← Volver a Medicamentos", seguido del título "Registro Rápido de Medicamento" y el subtítulo en texto gris. |
| 3 | | El sistema renderiza en primer lugar la tarjeta de "**Búsqueda Inteligente con IA**" (`.ai-card`), que tiene un fondo con degradado suave rosado (de `#fff5f5` a `#fff1f2`), borde de `1.5px solid #fecaca` y esquinas redondeadas. |
| 4 | | Debajo del selector de laboratorio, el sistema muestra el bloque del Paso 2 deshabilitado con un contenedor de borde discontinuo celeste (`#bfdbfe`) y fondo semi-transparente que dice: "🔼 Primero selecciona un laboratorio para habilitar la búsqueda". |
| 5 | El personal hace clic en el menú desplegable "Paso 1: Selecciona el Laboratorio *" y elige un laboratorio (ej. "Laboratorio Alfa"). | |
| 6 | | El sistema actualiza el estado y habilita el cuadro de texto del Paso 2 para buscar medicamentos correspondientes a dicho fabricante. |
| 7 | El personal escribe las primeras letras del medicamento en el campo del Paso 2 (ej. "Para"). | |
| 8 | | A partir del segundo carácter, el sistema busca en la lista de medicamentos existentes y despliega un menú flotante dropdown con un sombreado suave (`box-shadow`), listando hasta 6 sugerencias que coinciden con el nombre y pertenecen al laboratorio seleccionado. Cada fila muestra el nombre en negrita y su categoría en texto gris pequeño. |
| 9 | El personal hace clic en una de las sugerencias (ej. "Paracetamol 500mg"). | |
| 10 | | El sistema captura los datos del medicamento sugerido y autocompleta automáticamente los campos del formulario inferior: "Nombre del Medicamento" (Paracetamol 500mg), "Laboratorio" (Laboratorio Alfa) y "Categoría" (Analgésicos). El campo "Laboratorio" pasa a tener un fondo azul claro de solo lectura (`#f8faff`). |
| 11 | El personal se desplaza a la tarjeta de "**Completa estos datos manualmente**" (`.manual-section`), la cual tiene un fondo rosado degradado y borde rojo claro. | |
| 12 | El personal ingresa el Costo Unitario en dólares (ej. "0.15") en base a la boleta física. | |
| 13 | El personal ingresa el Precio de Venta para el público (ej. "0.50"). | |
| 14 | El personal ingresa el Stock Mínimo según políticas internas de la clínica (ej. "100"). | |
| 15 | El personal ingresa el Stock Inicial del lote físico que ingresa al almacén (ej. "500"). | |
| 16 | El personal ingresa el Número de Lote (ej. "LOTE-P2026-A"). | |
| 17 | El personal hace clic en el campo "Fecha de Vencimiento *" y selecciona la fecha mediante el selector nativo del navegador. | |
| 18 | El personal opcionalmente digita el código de Registro Sanitario. | |
| 19 | El personal hace clic en el botón rojo ancho "📋 Registrar Medicamento". | |
| 20 | | El sistema cambia el texto del botón a "Guardando..." y deshabilita los controles para evitar envíos duplicados. |
| 21 | | El sistema valida que todos los campos requeridos estén llenos y que los números de stock y costo sean positivos. |
| 22 | | El sistema formatea la fecha de vencimiento a formato `DD/MM/YYYY` e inserta los datos del medicamento y su lote en la base de datos MySQL, asociando el stock inicial al inventario actual. |
| 23 | | El sistema registra en el Historial de Actividad la inserción del nuevo lote del medicamento. |
| 24 | | El sistema despliega un mensaje emergente nativo: "✅ Medicamento registrado exitosamente." y redirige automáticamente al usuario al listado general de medicamentos. |

---

### Flujo alterno 1 – Datos numéricos inválidos

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal ingresa un stock inicial negativo o un costo unitario igual a cero. | |
| 2 | El personal hace clic en el botón "📋 Registrar Medicamento". | |
| 3 | | El sistema detecta mediante la validación del formulario HTML5 que los campos numéricos violan la restricción `min="0"` o `step="0.01"`. |
| 4 | | El navegador detiene el envío y muestra un globo de advertencia al lado del campo infractor pidiéndole corregir el valor. |
| 5 | El personal ajusta el número a un valor positivo válido y presiona nuevamente el botón de guardado. | |

---

### Flujo alterno 2 – Error en el servidor al guardar

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal hace clic en el botón "📋 Registrar Medicamento" con todos los datos completos. | |
| 2 | | El sistema intenta realizar la petición a la API backend. La base de datos o la red experimenta una caída momentánea. |
| 3 | | La API responde con un código de error de red o de servidor. |
| 4 | | El sistema captura el error en el bloque `catch` y despliega un cuadro de alerta emergente con el detalle: "Error: No se pudo conectar con el servidor MySQL." |
| 5 | | El botón vuelve a su estado normal de "📋 Registrar Medicamento" para que el usuario pueda intentar guardar nuevamente una vez se restablezca la conexión. |
