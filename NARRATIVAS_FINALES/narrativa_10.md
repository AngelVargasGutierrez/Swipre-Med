# UC-010 – Visualizar Semáforo de Stock de Medicamentos

## a) UC-010 – Visualizar Semáforo de Stock de Medicamentos

| Campo | Detalle |
|---|---|
| **Caso de uso** | UC-010 – Visualizar Semáforo de Stock de Medicamentos |
| **Actores** | Personal de Logística, Jefatura de Farmacia, Administrador |
| **Propósito** | Permitir visualizar de forma ágil y centralizada el estado del inventario mediante indicadores agregados de stock (Normal, Bajo y Crítico) para activar compras a tiempo. |
| **Tipo** | Obligatorio (X) / Opcional ( ) |
| **Requisito ID (RF)** | RF-010 |
| **Versión** | 1.0 |
| **Descripción** | El sistema muestra tres tarjetas de estadísticas (Stat Cards) de control de inventario en la parte superior de la página. Estas tarjetas calculan automáticamente la cantidad de productos con stock insuficiente comparando los niveles físicos con los mínimos establecidos, alertando visualmente en colores rojo, amarillo y naranja según el nivel de urgencia. |
| **Precondición** | El usuario debe estar autenticado en MOPGIMED con permisos de consulta de inventario. |
| **Postcondición** | El personal visualiza el estado consolidado de criticidad del stock sin alterar la base de datos. |

---

### Curso normal de eventos

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal autorizado hace clic en la opción "Inventario" del menú lateral vertical (Sidebar). | |
| 2 | | El sistema carga el módulo **Control de Inventario** en el área principal de la pantalla. |
| 3 | | El sistema carga el total de medicamentos de la base de datos y calcula dinámicamente las agrupaciones de stock basándose en la comparación `stock < stockMin` para determinar los estados. |
| 4 | | El sistema renderiza una fila superior con 3 Tarjetas de Estadísticas de Inventario (`.inv-stats-3`): |
| 5 | | - **Tarjeta 1: Stock Crítico/Vencido** (`.inv-stat-card.red`): Muestra un borde e iluminación sutil de color rojo vivo. A la izquierda, visualiza la etiqueta "Stock Crítico/Vencido", seguida del valor numérico calculado en tamaño gigante (ej. "7") y el subtítulo "Requieren atención inmediata". A la derecha, muestra un ícono de advertencia de peligro (`AlertTriangle` de color rojo y tamaño 28px). |
| 6 | | - **Tarjeta 2: Stock Bajo** (`.inv-stat-card.yellow`): Muestra un borde e iluminación de color amarillo/mostaza. A la izquierda, visualiza la etiqueta "Stock Bajo", seguida del valor numérico gigante de productos con stock por debajo del mínimo (ej. "5") y el subtítulo "Por debajo del mínimo". A la derecha, renderiza el ícono de una caja de mercancías (`Package` de color amarillo y tamaño 28px). |
| 7 | | - **Tarjeta 3: Próximos a Vencer (90 días)** (`.inv-stat-card.orange`): Muestra un borde e iluminación de color naranja/coral. A la izquierda, visualiza la etiqueta "Próximos a Vencer (90 días)", seguida del valor numérico gigante correspondiente (ej. "3") y el subtítulo "Monitoreo activo". A la derecha, muestra el ícono de un calendario (`Calendar` color naranja y tamaño 28px). |
| 8 | El personal lee los indicadores resumidos y comprende el nivel de urgencia actual del almacén en pocos segundos. | |

---

### Flujo alterno 1 – Inventario en estado óptimo (Cero alertas)

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal ingresa a la pantalla cuando todos los medicamentos del almacén cuentan con stock de seguridad suficiente. | |
| 2 | | El sistema consulta y verifica que ningún registro tiene `stock < stockMin`. |
| 3 | | La tarjeta "Stock Crítico/Vencido" se actualiza a un valor de "0". |
| 4 | | La tarjeta "Stock Bajo" se actualiza a un valor de "0". |
| 5 | El personal comprueba que no hay urgencias y continúa con sus labores de monitoreo de rutina. | |
