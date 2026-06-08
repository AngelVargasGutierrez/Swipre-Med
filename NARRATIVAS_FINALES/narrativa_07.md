# UC-007 – Listar Medicamentos (Buscador + Exportar Excel)

## a) UC-007 – Listar Medicamentos (Buscador + Exportar Excel)

| Campo | Detalle |
|---|---|
| **Caso de uso** | UC-007 – Listar Medicamentos (Buscador + Exportar Excel) |
| **Actores** | Personal de Logística, Jefatura de Farmacia, Administrador |
| **Propósito** | Permitir visualizar el inventario completo de medicamentos con un contador activo, realizar búsquedas generales y exportar el listado completo a formato Excel para informes administrativos. |
| **Tipo** | Obligatorio (X) / Opcional ( ) |
| **Requisito ID (RF)** | RF-007 |
| **Versión** | 1.0 |
| **Descripción** | El sistema provee un panel centralizado donde se lista el total de medicamentos del almacén. Incluye un buscador en tiempo real y un botón de exportación rápida para descargar un archivo de hoja de cálculo conteniendo la información detallada de stock, costos y vencimientos. |
| **Precondición** | El usuario debe estar autenticado en MOPGIMED con rol Logística, Jefatura o Administrador. |
| **Postcondición** | El usuario visualiza la lista completa de medicamentos en pantalla y puede descargar el catálogo completo formateado en Excel. |

---

### Curso normal de eventos

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal autorizado hace clic en la opción "Medicamentos" en el menú de navegación lateral (Sidebar). | |
| 2 | | El sistema carga la estructura gráfica de **Gestión de Medicamentos**. En la cabecera, muestra el título y el subtítulo, y en el extremo derecho renderiza un botón verde oliva con el texto "Exportar a Excel" junto a un ícono de hoja de cálculo, al lado del botón rojo "Nuevo Medicamento". |
| 3 | | El sistema consulta el servidor API mediante `api.getMedicamentos()` y recupera todos los registros ordenados alfabéticamente. |
| 4 | | El sistema renderiza la tabla de datos principal. En la parte superior de la tabla, muestra una etiqueta dinámica que indica la cantidad actual de registros: "Mostrando **X** de Y medicamentos" (ej. "Mostrando **45** de 45 medicamentos"). |
| 5 | | El sistema dibuja las filas de la tabla con información técnica completa: Nombre del producto, Categoría, Laboratorio, Número de Lote (monospace), Stock actual con stock mínimo de seguridad debajo, Costo Unitario, Fecha de Vencimiento y un Badge de color que indica el Estado de Stock. |
| 6 | El personal hace clic en la caja de búsqueda "Buscar medicamento..." e ingresa una palabra clave (ej. "Bayer"). | |
| 7 | | El sistema filtra el listado completo de medicamentos en tiempo real por el nombre del medicamento, el código, el laboratorio fabricante o la categoría. El contador dinámico se actualiza al instante: "Mostrando **12** de 45 medicamentos". |
| 8 | El personal hace clic en el botón verde "Exportar a Excel" ubicado en la cabecera del módulo. | |
| 9 | | El sistema recopila la lista de medicamentos filtrados (o todo el catálogo en caso de no haber búsquedas activas) y genera en memoria del navegador una estructura de archivo Excel (`.xlsx`) con las columnas ordenadas. |
| 10 | | El sistema inicia automáticamente la descarga del archivo en el navegador del usuario con el nombre `inventario_mopgimed_completo.xlsx`. |
| 11 | El personal abre el archivo descargado en su computadora para validar los datos e incorporarlos a su hoja de cálculo local. | |

---

### Flujo alterno 1 – Catálogo de inventario vacío

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal accede al módulo "Medicamentos" cuando no se ha registrado ningún producto en el sistema (base de datos vacía). | |
| 2 | | El sistema realiza la consulta a la API pero recibe un arreglo de datos vacío `[]`. |
| 3 | | El contador dinámico se actualiza a: "Mostrando **0** de 0 medicamentos". |
| 4 | | El sistema oculta la lista y dibuja una celda única en la tabla con el mensaje centralizado: "No hay medicamentos registrados en el sistema. Presione el botón 'Nuevo Medicamento' para registrar el primero." |
| 5 | | El botón "Exportar a Excel" queda deshabilitado y adquiere un tono grisáceo semitransparente para evitar descargas de archivos vacíos. |
