# UC-013 – Filtrar Lista de Vencimientos

## a) UC-013 – Filtrar Lista de Vencimientos

| Campo | Detalle |
|---|---|
| **Caso de uso** | UC-013 – Filtrar Lista de Vencimientos |
| **Actores** | Personal de Logística, Jefatura de Farmacia, Administrador |
| **Propósito** | Refinar el listado de vencimientos de medicamentos mediante filtros avanzados (por laboratorio y rango de meses/años) para coordinar devoluciones a laboratorios o campañas de liquidación de stock. |
| **Tipo** | Opcional ( ) / Obligatorio (X) |
| **Requisito ID (RF)** | RF-013 |
| **Versión** | 1.0 |
| **Descripción** | En la vista de Control de Inventario, al activarse la pestaña "Por Vencer", el sistema despliega un panel de filtros avanzados que permite filtrar la lista de productos por vencer según el Laboratorio fabricante, el Mes o el Año específico de caducidad, actualizando la tabla al instante. |
| **Precondición** | El usuario debe estar autenticado y posicionado en la pestaña "Por Vencer" del módulo Control de Inventario. |
| **Postcondición** | La tabla muestra únicamente los medicamentos que van a vencer en el período y laboratorio seleccionados. |

---

### Curso normal de eventos

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal autorizado hace clic en la pestaña "**Por Vencer (X)**" (`key: 'vencer'`) en la pantalla de Control de Inventario. | |
| 2 | | El sistema filtra el inventario para extraer únicamente los lotes con fecha de vencimiento menor o igual a 90 días o ya caducados. |
| 3 | | El sistema despliega un panel de filtros avanzados de vencimiento de fondo rosado pálido en la parte superior. Este panel contiene dos selectores desplegables:<br>1. "Filtrar por Laboratorio"<br>2. "Filtrar por Mes / Año de Vencimiento" |
| 4 | El personal hace clic en el selector "Filtrar por Laboratorio" y elige una marca específica (ej. "Laboratorio Alfa"). | |
| 5 | | El sistema filtra localmente el listado de vencimientos y muestra en la tabla únicamente los medicamentos de "Laboratorio Alfa" que vencen pronto. |
| 6 | El personal hace clic en el selector de "Filtrar por Mes / Año de Vencimiento" y selecciona un mes específico (ej. "Junio 2026"). | |
| 7 | | El sistema combina ambos criterios de filtrado y actualiza la tabla de inmediato. Muestra solo los lotes de "Laboratorio Alfa" cuya fecha de caducidad cae dentro de junio de 2026. El contador dinámico refleja la cantidad exacta. |
| 8 | El personal visualiza y audita los registros filtrados, anotando los lotes exactos para iniciar el proceso de retiro y devolución física al laboratorio. | |

---

### Flujo alterno 1 – Sin coincidencias de vencimientos en filtros

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal aplica un filtro de mes o laboratorio donde no hay ningún medicamento por vencer. | |
| 2 | | El sistema ejecuta el filtrado y comprueba que ningún registro coincide con los criterios aplicados. |
| 3 | | El sistema actualiza el contador de filas a: "Mostrando **0** medicamentos". |
| 4 | | La tabla oculta sus filas ordinarias y renderiza un aviso central: "No se encontraron vencimientos activos para los filtros seleccionados." |
| 5 | El personal selecciona "Todos los laboratorios" o restablece el mes para restaurar la vista de vencimientos general. | |
| 6 | | El sistema recarga la lista mostrando de nuevo todos los lotes próximos a vencer de la clínica. |
