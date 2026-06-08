# UC-011 – Visualizar Semáforo de Medicamentos por Vencer / Vencidos

## a) UC-011 – Visualizar Semáforo de Medicamentos por Vencer / Vencidos

| Campo | Detalle |
|---|---|
| **Caso de uso** | UC-011 – Visualizar Semáforo de Medicamentos por Vencer / Vencidos |
| **Actores** | Personal de Logística, Jefatura de Farmacia, Administrador |
| **Propósito** | Identificar de forma inmediata e interactiva mediante un código de colores (semáforo) aquellos medicamentos que están próximos a caducar (dentro de los 90 días) o que ya se encuentran vencidos, para evitar infracciones sanitarias y mermas. |
| **Tipo** | Obligatorio (X) / Opcional ( ) |
| **Requisito ID (RF)** | RF-011 |
| **Versión** | 1.0 |
| **Descripción** | El sistema calcula dinámicamente los días que restan antes de la fecha de caducidad física de cada lote y asigna alertas semafóricas en la columna "Días Restantes" de la tabla. Utiliza etiquetas grises para lotes vencidos, etiquetas rojas para vencimientos en menos de 30 días y etiquetas amarillas para vencimientos entre 30 y 90 días, proporcionando una auditoría visual inmediata. |
| **Precondición** | El usuario debe estar autenticado en MOPGIMED. Deben existir medicamentos con lotes registrados y fechas de vencimiento válidas. |
| **Postcondición** | El usuario visualiza la clasificación cromática por proximidad de vencimiento para cada lote listado. |

---

### Curso normal de eventos

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal autorizado hace clic en la opción "Inventario" del menú lateral vertical (Sidebar). | |
| 2 | | El sistema carga la interfaz gráfica de **Control de Inventario** y calcula los días restantes para cada lote comparando la fecha de vencimiento contra la fecha local actual (`TODAY`). |
| 3 | | El sistema renderiza la tabla de inventario, incluyendo la columna "Fecha Vencimiento" y la columna "Días Restantes". |
| 4 | | El sistema llena la columna "Días Restantes" aplicando las siguientes alertas cromáticas automáticas por fila:<br><br>- **Lotes Vencidos (Días < 0):** Muestra una etiqueta rectangular gris con el texto "**Vencido**" (`background: #f3f4f6; color: #6b7280`).<br>- **Crítico (0 a 30 días):** Muestra un badge rojo vivo con letras blancas que indica la cantidad exacta de días (ej. "**14 días**").<br>- **Advertencia (31 a 90 días):** Muestra un badge amarillo con letras blancas con los días (ej. "**75 días**").<br>- **Seguro (Más de 90 días):** Muestra los días en texto simple gris oscuro sin ningún fondo especial (ej. "320 días"). |
| 5 | El personal revisa visualmente la columna para identificar los lotes que requieren devolución prioritaria al proveedor o que deben ser retirados de los estantes de forma urgente. | |

---

### Flujo alterno 1 – Medicamento sin fecha de vencimiento (Lote manual omitido)

| # | Usuario | Sistema |
|---|---|---|
| 1 | El sistema carga un medicamento cuya fecha de vencimiento no fue especificada o quedó en blanco. | |
| 2 | | El sistema detecta la ausencia de fecha de vencimiento. |
| 3 | | Para evitar falsas alarmas, el sistema asigna un valor por defecto de días restantes muy elevado y renderiza el campo de días como vacío o muestra un texto informativo: "Sin vencimiento". |
| 4 | El personal detecta la omisión técnica y decide hacer clic en Editar para corregir la fecha de vencimiento real del lote físico. | |
