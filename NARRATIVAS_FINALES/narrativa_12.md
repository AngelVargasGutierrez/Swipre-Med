# UC-012 – Listar Medicamentos con Semáforo

## a) UC-012 – Listar Medicamentos con Semáforo

| Campo | Detalle |
|---|---|
| **Caso de uso** | UC-012 – Listar Medicamentos con Semáforo |
| **Actores** | Personal de Logística, Jefatura de Farmacia, Administrador |
| **Propósito** | Desplegar el listado completo de medicamentos del inventario aplicando un código de colores (semáforo) en cada fila según su estado operativo de stock. |
| **Tipo** | Obligatorio (X) / Opcional ( ) |
| **Requisito ID (RF)** | RF-012 |
| **Versión** | 1.0 |
| **Descripción** | El sistema muestra la tabla completa de inventario en el módulo Control de Inventario. Asigna badges semafóricos por fila en la columna "Estado Stock": rojo vivo para medicamentos en estado Crítico (stock cero o crítico), amarillo para estado Bajo (por debajo del mínimo) y verde para estado Normal (stock adecuado), permitiendo una auditoría visual masiva del almacén. |
| **Precondición** | El usuario debe estar autenticado en MOPGIMED y acceder al módulo Control de Inventario. |
| **Postcondición** | El usuario visualiza la tabla organizada con el semáforo aplicado a cada registro. |

---

### Curso normal de eventos

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal de Logística o Jefatura hace clic en el botón "Inventario" del menú lateral vertical. | |
| 2 | | El sistema carga el módulo **Control de Inventario** y muestra una cabecera con el título "Control de Inventario" y el subtítulo. |
| 3 | | Inmediatamente debajo de las tarjetas de estadísticas, el sistema renderiza un bloque de control de pestañas horizontales (`tab-btn`) con clase `.card`. |
| 4 | | El sistema carga la tabla principal con las columnas: "Medicamento", "Stock", "Estado Stock", "Fecha Vencimiento", "Días Restantes" y "Lote". |
| 5 | | Por cada registro en la tabla, el sistema calcula y dibuja etiquetas de colores en la columna "**Estado Stock**" (`.badge`):<br><br>- **Normal:** Muestra un badge de fondo verde brillante con texto blanco que dice "**Normal**".<br>- **Bajo:** Muestra un badge de fondo amarillo mostaza con texto blanco que dice "**Bajo**".<br>- **Crítico:** Muestra un badge de fondo rojo vivo con texto blanco que dice "**Crítico**". |
| 6 | El personal examina la tabla interactiva y percibe visualmente las zonas con mayor criticidad operativa. | |

---

### Flujo alterno 1 – Navegación por pestañas de criticidad

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal desea ver únicamente los productos en estado Crítico para planificar órdenes de compra. | |
| 2 | El personal hace clic en el botón de pestaña "**Críticos (X)**" (`key: 'critico'`). | |
| 3 | | El sistema aplica el filtro en tiempo real en la vista local y reduce la lista para mostrar solo las filas cuyo estado de stock sea exactamente igual a "Crítico". |
| 4 | | El sistema actualiza el texto de conteo a: "Mostrando **X** medicamentos", donde X es la cantidad de críticos. |
| 5 | El personal revisa la lista depurada y exporta o copia la información requerida. | |
| 6 | El personal hace clic en la pestaña "**Todos (X)**" para regresar a la vista completa del inventario. | |
| 7 | | El sistema retira el filtro y despliega nuevamente el total de registros en la tabla. |
