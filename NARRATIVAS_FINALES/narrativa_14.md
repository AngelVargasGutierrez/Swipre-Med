# UC-014 – Generar Reporte General de Medicamentos

## a) UC-014 – Generar Reporte General de Medicamentos

| Campo | Detalle |
|---|---|
| **Caso de uso** | UC-014 – Generar Reporte General de Medicamentos |
| **Actores** | Jefatura de Farmacia, Administrador |
| **Propósito** | Permitir emitir un reporte consolidado y valorizado de todos los medicamentos en inventario en un período específico, posibilitando aplicar filtros y descargarlo en formato Excel para balances contables. |
| **Tipo** | Obligatorio (X) / Opcional ( ) |
| **Requisito ID (RF)** | RF-014 |
| **Versión** | 1.0 |
| **Descripción** | La Jefatura de Farmacia puede consultar en pantalla un informe general de valorización de activos. El sistema despliega 4 tarjetas de indicadores financieros (Total de Medicamentos, Valor de Compra del Inventario, Valor de Venta y Ganancia Estimada), una tabla valorizada columna por columna, filtros por fechas y un botón verde de exportación a Excel. |
| **Precondición** | El usuario debe estar autenticado con rol Jefatura de Farmacia o Administrador. Deben existir medicamentos registrados con sus respectivos lotes, stocks y costos. |
| **Postcondición** | El sistema muestra los datos financieros consolidados en pantalla y genera el archivo Excel para descarga local. |

---

### Curso normal de eventos

| # | Usuario | Sistema |
|---|---|---|
| 1 | La Jefatura de Farmacia hace clic en la opción "Reportes" del menú lateral vertical. | |
| 2 | | El sistema carga el módulo **Reportes** en el área principal de la pantalla. En la cabecera muestra el título "Reportes" y su subtítulo. |
| 3 | | Inmediatamente abajo, el sistema renderiza la tarjeta de selección de "**Tipo de Reporte**" (`.report-type-grid`) con tres tarjetas disponibles: "Reporte General", "Ingresos y Salidas" y "Mayor Rotación". Por defecto, se encuentra seleccionada la tarjeta "Reporte General" (destacada en azul). |
| 4 | | Debajo del selector de reportes, el sistema renderiza la tarjeta de "**Filtros de Fecha**" con los campos "Fecha Desde" e "Fecha Hasta", y a la derecha un botón verde oliva con el texto "Exportar a Excel" y el ícono de descarga (`Download` de 16px). |
| 5 | La Jefatura ingresa el rango de fechas para su balance (ej. Desde: "01/04/2026" - Hasta: "15/04/2026"). | |
| 6 | | El sistema recibe los datos de fecha, realiza los cálculos en el servidor API y carga los resultados en la tarjeta inferior "**Reporte General de Inventario**". |
| 7 | | El sistema dibuja una cuadrícula de 4 tarjetas de resumen financiero con fondo degradado azul claro (`linear-gradient(135deg, #f8faff, #eff6ff)`), bordes celestes (`#dbeafe`) y textos con colores semánticos destacados:<br><br>- **Total Medicamentos:** Cantidad de productos en negrita color rojo oscuro (`#b91c1c`, ej. "24").<br>- **Valor Inventario:** Costo total de compra en negrita color verde (`#059669`, ej. "$3,450.00").<br>- **Valor de Venta:** Ingreso proyectado por venta al público en negrita color ámbar (`#d97706`, ej. "$5,175.00").<br>- **Ganancia Estimada:** Margen neto proyectado en negrita color morado (`#7c3aed`, ej. "$1,725.00"). |
| 8 | | Debajo de las 4 tarjetas financieras, el sistema renderiza la tabla de datos completa, con las columnas: "Código" (monospace), "Medicamento", "Laboratorio", "Lote" (monospace), "Stock", "Costo Unit.", "P. Venta", "Valor Inv." (stock * costo unitario destacado en rojo) y "Estado". |
| 9 | La Jefatura revisa la información financiera desplegada en la pantalla y hace clic en el botón verde "Exportar a Excel". | |
| 10 | | El sistema genera el archivo de hoja de cálculo `.xlsx` en memoria conteniendo los 4 indicadores resumidos en la primera sección y la tabla valorizada en la parte inferior, e inicia de inmediato su descarga automática. |

---

### Flujo alterno 1 – Rango de fechas ilógico (Desde posterior a Hasta)

| # | Usuario | Sistema |
|---|---|---|
| 1 | La Jefatura ingresa por error una "Fecha Desde" que es cronológicamente posterior a la "Fecha Hasta" (ej. Desde: "20/04/2026" - Hasta: "05/04/2026"). | |
| 2 | | El sistema detecta la incongruencia de fechas de forma instantánea. |
| 3 | | El sistema bloquea el botón "Exportar a Excel", tiñéndolo de un color grisáceo opaco. |
| 4 | | El sistema muestra un mensaje de advertencia de letras rojo oscuro debajo de los campos de fecha: "La fecha inicial no puede ser posterior a la fecha final de consulta." |
| 5 | La Jefatura corrige el rango de fechas a un período lógico. | |
| 6 | | El sistema remueve la advertencia y vuelve a habilitar los controles operativos. |
