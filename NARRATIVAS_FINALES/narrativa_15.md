# UC-015 – Generar Reporte de Ingresos y Salidas (Filtro por Tiempo)

## a) UC-015 – Generar Reporte de Ingresos y Salidas (Filtro por Tiempo)

| Campo | Detalle |
|---|---|
| **Caso de uso** | UC-015 – Generar Reporte de Ingresos y Salidas (Filtro por Tiempo) |
| **Actores** | Jefatura de Farmacia, Administrador |
| **Propósito** | Permitir consultar detalladamente y exportar el flujo histórico de ingresos (compras/abastecimientos) y salidas (dispensaciones/ventas/mermas) de medicamentos de la clínica en un período semanal o mensual. |
| **Tipo** | Obligatorio (X) / Opcional ( ) |
| **Requisito ID (RF)** | RF-015 |
| **Versión** | 1.0 |
| **Descripción** | El sistema recopila la data transaccional del almacén y genera un consolidado de movimientos de entrada y salida para el rango de tiempo seleccionado. Muestra métricas de unidades movilizadas, valorización del flujo físico de medicamentos y habilita la exportación directa a Excel para auditorías de flujo de caja. |
| **Precondición** | El usuario debe estar autenticado con rol Jefatura de Farmacia o Administrador. Deben existir movimientos transaccionales registrados en el período de consulta. |
| **Postcondición** | La Jefatura visualiza el resumen detallado de ingresos y salidas en pantalla y descarga el reporte en formato Excel. |

---

### Curso normal de eventos

| # | Usuario | Sistema |
|---|---|---|
| 1 | La Jefatura de Farmacia hace clic en la opción "Reportes" del menú lateral izquierdo. | |
| 2 | | El sistema carga el módulo **Reportes** y por defecto muestra la pestaña "Reporte General" seleccionada. |
| 3 | La Jefatura hace clic en la segunda tarjeta de selección de tipo de reporte: "**Ingresos y Salidas**" (`key: 'movimientos'`). | |
| 4 | | El sistema resalta la tarjeta en color azul, cambiando el color del ícono (`TrendingUp` a azul brillante `#2563eb`) y actualizando el estado local. |
| 5 | La Jefatura se posiciona en el bloque de filtros de fecha y selecciona un rango de consulta (ej. Desde: "01/05/2026" - Hasta: "07/05/2026" para un balance semanal). | |
| 6 | | El sistema recupera el registro de movimientos transaccionales de inventario desde el backend para las fechas indicadas. |
| 7 | | El sistema renderiza en la sección inferior una tarjeta blanca titulada "**Reporte de Ingresos y Salidas**", desplegando un cuadro resumen con 2 métricas principales:<br><br>- **Total de Entradas (Ingresos):** Sumatoria de unidades de medicamentos ingresadas físicamente por compras o devoluciones de proveedores (ej. "1,200 unidades").<br>- **Total de Salidas (Dispensaciones):** Sumatoria de unidades retiradas de stock por ventas en ventanilla o mermas (ej. "980 unidades"). |
| 8 | | Debajo del resumen, el sistema renderiza una tabla con el log detallado de transacciones con las columnas: "Fecha / Hora", "Medicamento", "Tipo Movimiento" (con badges que dicen "Ingreso" en verde o "Salida" en rojo), "Cantidad", "Lote afectado" y "Responsable". |
| 9 | La Jefatura hace clic en el botón verde "Exportar a Excel" a la derecha de los filtros de fecha. | |
| 10 | | El sistema recopila el log histórico del rango seleccionado, genera un archivo Excel con el detalle de las transacciones y lo descarga automáticamente al equipo de la Jefatura. |

---

### Flujo alterno 1 – Período de consulta sin transacciones en el inventario

| # | Usuario | Sistema |
|---|---|---|
| 1 | La Jefatura selecciona un rango de fechas muy antiguo o en el que no se registraron ingresos ni salidas de medicamentos. | |
| 2 | | El sistema procesa la consulta de movimientos pero la base de datos devuelve un conjunto de datos vacío `[]`. |
| 3 | | El sistema actualiza el panel inferior y muestra un mensaje centrado en texto gris: "No se registraron movimientos de ingresos ni salidas en el período seleccionado." |
| 4 | | El botón de exportación a Excel se deshabilita para resguardar la descarga de documentos en blanco. |
| 5 | La Jefatura modifica el rango de fechas seleccionando una semana activa de operaciones. | |
| 6 | | El sistema realiza la consulta y carga de forma inmediata la tabla con el flujo transaccional. |
