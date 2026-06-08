# UC-006 – Consultar Medicamento (Disponibilidad y Precio)

## a) UC-006 – Consultar Medicamento (Disponibilidad y Precio)

| Campo | Detalle |
|---|---|
| **Caso de uso** | UC-006 – Consultar Medicamento (Disponibilidad y Precio) |
| **Actores** | Personal de Caja Farmacia, Técnico de Farmacia, Jefatura, Administrador |
| **Propósito** | Permitir al personal de ventanilla o caja buscar rápidamente la disponibilidad de stock, el lote y el precio de venta al público de cualquier medicamento en tiempo real. |
| **Tipo** | Obligatorio (X) / Opcional ( ) |
| **Requisito ID (RF)** | RF-006 |
| **Versión** | 1.0 |
| **Descripción** | El personal de Caja Farmacia puede realizar consultas rápidas en el inventario mediante el buscador de autocompletado inteligente. El sistema le muestra de inmediato el stock actual, precio de venta, fecha de vencimiento y lote, sin permitirle realizar ninguna modificación ni borrado físico en el catálogo (modo de lectura restrictivo). |
| **Precondición** | El personal debe haber iniciado sesión en MOPGIMED con rol Caja Farmacia o superior. |
| **Postcondición** | Se muestra la información consultada en pantalla de forma exitosa sin alterar ningún dato en la base de datos MySQL. |

---

### Curso normal de eventos

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal de Caja Farmacia hace clic en la opción "Medicamentos" del menú lateral vertical (Sidebar). | |
| 2 | | El sistema carga la vista del módulo en el lado derecho de la pantalla con un fondo claro. Debido al rol del usuario (Caja Farmacia), el botón rojo "Nuevo Medicamento" (+) no se renderiza en la cabecera para garantizar la integridad operativa. |
| 3 | | El sistema carga la tarjeta blanca de "**Búsqueda Inteligente con IA**" (`.ai-card`) con su característico fondo rosado pálido y el cuadro de búsqueda (`.search-box`) en el centro. |
| 4 | | Debajo del buscador, el sistema llena la tabla principal con los medicamentos registrados en tiempo real, mostrando las columnas: "Medicamento", "Laboratorio", "Lote", "Stock", "Vencimiento", "Estado" y "Acciones". |
| 5 | El personal hace clic en el campo de texto "Buscar medicamento..." e ingresa el nombre del producto que solicita el cliente (ej. "Paracetamol"). | |
| 6 | | El sistema intercepta el evento de entrada y filtra de manera instantánea (en tiempo real) las filas de la tabla principal para mostrar solo los registros que coinciden con el término de búsqueda. |
| 7 | | El sistema muestra los resultados en la fila correspondiente, destacando:<br>- **Nombre y Categoría:** Paracetamol 500mg (Analgésicos) en negrita.<br>- **Lote:** El código de lote con tipografía monospace gris.<br>- **Stock:** El número exacto disponible (ej. "320") y abajo en color gris el stock mínimo.<br>- **Vencimiento:** La fecha límite del lote (ej. "19/08/2027").<br>- **Estado:** Un badge de color (verde si es Normal, amarillo si es Bajo, rojo si es Crítico). |
| 8 | El personal localiza la fila del producto deseado en la tabla y hace clic en el botón de acción con el ícono de ojo (👁) para consultar la ficha a detalle. | |
| 9 | | El sistema abre una ventana modal emergente con los metadatos completos del medicamento. En el centro de la pantalla se despliega el Precio de Venta al Público (ej. "$0.50 por unidad") destacado en negrita y fuente más grande. |
| 10 | El personal lee el precio de venta y la disponibilidad al cliente, cierra la ventana modal y procede con el cobro. | |

---

### Flujo alterno 1 – Medicamento sin stock disponible (Semáforo Crítico)

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal busca un medicamento y localiza la fila correspondiente en la tabla. | |
| 2 | | El sistema destaca visualmente la columna "Stock" mostrando "0" en color negrita y un badge de Estado de color rojo vivo que muestra el texto "Crítico". |
| 3 | El personal visualiza el estado crítico y notifica de inmediato al cliente que no hay disponibilidad física, sugiriendo opcionalmente un sustituto genérico equivalente. | |

---

### Flujo alterno 2 – Búsqueda sin coincidencias

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal digita un término o código que no existe en el catálogo de la clínica (ej. "Xyloferina"). | |
| 2 | | El sistema realiza el filtrado de las filas y devuelve un arreglo vacío. |
| 3 | | El sistema oculta la lista habitual y renderiza en medio de la tabla un mensaje centrado en texto gris claro: "No se encontraron medicamentos con ese criterio de búsqueda." |
| 4 | El personal borra el texto de búsqueda utilizando la tecla retroceso. | |
| 5 | | El sistema detecta el campo vacío y vuelve a listar la totalidad de los medicamentos registrados de forma instantánea. |
