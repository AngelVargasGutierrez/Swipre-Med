# UC-008 – Filtrar Listado de Medicamentos

## a) UC-008 – Filtrar Listado de Medicamentos

| Campo | Detalle |
|---|---|
| **Caso de uso** | UC-008 – Filtrar Listado de Medicamentos |
| **Actores** | Personal de Logística, Jefatura de Farmacia, Administrador |
| **Propósito** | Permitir refinar de manera rápida la tabla de inventario general mostrando únicamente los medicamentos fabricados por un laboratorio específico seleccionado. |
| **Tipo** | Obligatorio (X) / Opcional ( ) |
| **Requisito ID (RF)** | RF-008 |
| **Versión** | 1.0 |
| **Descripción** | El sistema proporciona un filtro de selección que extrae de manera dinámica los laboratorios registrados en la base de datos. Al seleccionar un laboratorio del menú desplegable, la tabla de medicamentos se refresca al instante para mostrar solo los fármacos de esa procedencia, facilitando la toma de decisiones por marcas de fabricación. |
| **Precondición** | El usuario debe haber iniciado sesión y estar en la pantalla de "Medicamentos". |
| **Postcondición** | La tabla se actualiza mostrando el subconjunto de medicamentos correspondientes al laboratorio seleccionado. |

---

### Curso normal de eventos

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal autorizado se posiciona en el módulo de "Medicamentos". | |
| 2 | | El sistema carga en pantalla la tarjeta blanca titulada "**Filtrar por Laboratorio**" (`.card`) ubicada inmediatamente debajo del bloque de búsqueda inteligente con IA. Dicha tarjeta muestra un pequeño ícono de embudo (`Filter` color `#64748b`) seguido del título del filtro. |
| 3 | | Inmediatamente debajo del título, el sistema despliega el selector dropdown con clase `filter-select`. El valor predeterminado es "Todos los laboratorios". |
| 4 | El personal hace clic en el selector "Todos los laboratorios". | |
| 5 | | El sistema despliega el menú con la lista completa de laboratorios activos e independientes recuperados dinámicamente de la base de datos (ej. "Bayer", "Pfizer", "Sanofi", "GlaxoSmithKline"). |
| 6 | El personal selecciona un laboratorio de la lista (ej. "Pfizer"). | |
| 7 | | El sistema actualiza el estado local (`labFilter`) y vuelve a calcular al instante el filtro de la tabla de medicamentos. |
| 8 | | La tabla se actualiza mostrando únicamente las filas de medicamentos cuyo laboratorio fabricante coincide exactamente con "Pfizer". El contador de arriba a la derecha cambia indicando, por ejemplo: "Mostrando **5** de 45 medicamentos". |
| 9 | El personal hace clic adicionalmente en el buscador por texto y escribe "Atorvastatina". | |
| 10 | | El sistema combina ambos filtros activos (Laboratorio = "Pfizer" y Texto = "Atorvastatina") y muestra únicamente las filas que cumplen con ambas condiciones en tiempo real, actualizando el contador dinámico. |

---

### Flujo alterno 1 – Restablecer el filtro

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal desea volver a ver todos los medicamentos sin restricciones de fabricante. | |
| 2 | El personal hace clic en el selector de laboratorio y elige la primera opción de la lista: "Todos los laboratorios". | |
| 3 | | El sistema vacía el estado del filtro (`labFilter = ''`). |
| 4 | | El sistema recalcula la lista e inmediatamente muestra la totalidad de medicamentos en la tabla, restableciendo el contador a su valor original de catálogo. |
