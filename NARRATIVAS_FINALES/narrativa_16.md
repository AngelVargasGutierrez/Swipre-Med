# UC-016 – Generar Reporte de Rotación de Medicamentos

## a) UC-016 – Generar Reporte de Rotación de Medicamentos

| Campo | Detalle |
|---|---|
| **Caso de uso** | UC-016 – Generar Reporte de Rotación de Medicamentos |
| **Actores** | Jefatura de Farmacia, Administrador |
| **Propósito** | Identificar los medicamentos con mayor y menor volumen de salidas comerciales (nivel de rotación) en un lapso determinado para optimizar el capital de trabajo de la clínica, evitando compras innecesarias. |
| **Tipo** | Opcional ( ) / Obligatorio (X) |
| **Requisito ID (RF)** | RF-016 |
| **Versión** | 1.0 |
| **Descripción** | El sistema clasifica los medicamentos agrupándolos de mayor a menor índice de salida según el registro de dispensaciones. La Jefatura de Farmacia puede filtrar por rango de tiempo y consultar un listado jerárquico (ranking) con etiquetas de nivel de rotación (Alta, Media, Baja), además de exportar la información a un reporte contable de Excel. |
| **Precondición** | El usuario debe estar autenticado con rol Jefatura de Farmacia o Administrador en MOPGIMED. |
| **Postcondición** | El sistema genera el ranking de rotación en pantalla y genera el archivo Excel para descarga local. |

---

### Curso normal de eventos

| # | Usuario | Sistema |
|---|---|---|
| 1 | La Jefatura de Farmacia hace clic en la opción "Reportes" del menú lateral izquierdo. | |
| 2 | | El sistema carga el módulo **Reportes** en el área derecha con fondo claro. |
| 3 | La Jefatura hace clic en la tercera tarjeta de tipo de reporte: "**Mayor Rotación**" (`key: 'rotacion'`). | |
| 4 | | El sistema resalta la tarjeta de rotación en color azul, cambiando el color del ícono (`RotateCcw` a azul brillante `#2563eb`) y cargando el estado local correspondiente. |
| 5 | La Jefatura ajusta el rango de tiempo (ej. Desde: "01/04/2026" - Hasta: "30/04/2026" para un balance mensual de rotación). | |
| 6 | | El sistema recopila el volumen de salidas de medicamentos en dicho rango, ordenándolos en forma descendente por la cantidad de unidades dispensadas. |
| 7 | | El sistema renderiza en la sección inferior una tarjeta blanca titulada "**Reporte de Mayor Rotación**" conteniendo una tabla ordenada con las columnas: "Posición", "Medicamento", "Laboratorio", "Categoría", "Unidades Dispensadas", "Stock Actual" y "Nivel de Rotación". |
| 8 | | En la columna "Nivel de Rotación", el sistema asigna insignias (badges) estilizadas de acuerdo al volumen comercial de salidas:<br><br>- **Alta Rotación (Top 20%):** Badge color púrpura con el texto "**Alta Rotación**".<br>- **Media Rotación:** Badge color azul con el texto "**Media**".<br>- **Baja Rotación:** Badge color gris con el texto "**Baja**". |
| 9 | La Jefatura analiza el ranking (ej. Paracetamol 500mg liderando con "1,500 unidades vendidas") y hace clic en el botón verde "Exportar a Excel". | |
| 10 | | El sistema genera y descarga automáticamente un documento Excel estructurado con la lista ordenada de rotación comercial para el mes consultado. |

---

### Flujo alterno 1 – Listado sin dispensaciones registradas en el período

| # | Usuario | Sistema |
|---|---|---|
| 1 | La Jefatura selecciona un período de tiempo en el que aún no se han registrado dispensaciones o ventas. | |
| 2 | | El sistema efectúa la consulta pero el acumulador de ventas devuelve cero transacciones. |
| 3 | | El sistema muestra en pantalla un mensaje centrado en color gris claro: "No se registran dispensaciones comerciales de medicamentos en el período de consulta seleccionado." |
| 4 | La Jefatura amplía el rango de fechas en los filtros para capturar los meses anteriores de operación. | |
| 5 | | El sistema carga la tabla de forma instantánea actualizando las posiciones del ranking de rotación. |
