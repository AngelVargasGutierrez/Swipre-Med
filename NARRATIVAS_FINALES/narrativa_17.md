# UC-017 – Visualizar Dashboard Analítico (Operativo + Inteligente ML/IA)

## a) UC-017 – Visualizar Dashboard Analítico (Operativo + Inteligente ML/IA)

| Campo | Detalle |
|---|---|
| **Caso de uso** | UC-017 – Visualizar Dashboard Analítico (Operativo + Inteligente ML/IA) |
| **Actores** | Jefatura de Farmacia, Personal de Logística, Administrador |
| **Propósito** | Visualizar métricas operativas en tiempo real y proyecciones predictivas de la demanda asistidas por algoritmos de Machine Learning (ML) y algoritmos inteligentes (IA) para optimizar el inventario. |
| **Tipo** | Obligatorio (X) / Opcional ( ) |
| **Requisito ID (RF)** | RF-017 |
| **Versión** | 1.0 |
| **Descripción** | El sistema provee dos interfaces avanzadas de análisis de datos: 1) El **Dashboard Operativo**, que consolida indicadores de stock activo, valor total, alertas críticas y gráficos transaccionales semanales; y 2) El **Dashboard Inteligente (Analytics)**, que presenta proyecciones de demanda a futuro mediante curvas predictivas, alertas predictivas de quiebre de stock a 30 días, tendencias porcentuales por categorías y tarjetas de recomendación financiera asistidas por IA. |
| **Precondición** | El usuario debe estar autenticado en MOPGIMED con rol de Jefatura de Farmacia o de Logística. |
| **Postcondición** | El usuario obtiene una visión integral y predictiva del estado financiero y logístico del almacén para planificar las compras y abastecimientos. |

---

### Curso normal de eventos – Consultar Dashboard Operativo

| # | Usuario | Sistema |
|---|---|---|
| 1 | El usuario autorizado hace clic en la opción "Dashboard" del menú lateral vertical. | |
| 2 | | El sistema carga la interfaz gráfica de **Dashboard** en el lado derecho. En la parte superior, muestra el título y el subtítulo correspondientes. |
| 3 | | El sistema carga la cuadrícula de 4 Tarjetas de Estadísticas Operativas (`.stats-grid`):<br>- **Total Medicamentos:** En badge azul, valor de catálogo de productos activos (ej. "45").<br>- **Stock Crítico:** En badge rojo, cantidad de medicamentos bajo quiebre de stock (ej. "4").<br>- **Por Vencer (30 días):** En badge amarillo, lotes con vencimiento inminente (ej. "3").<br>- **Valor Total:** En badge verde, el costo monetario del inventario valorizado (ej. "$3,450.00"). |
| 4 | | Debajo de las tarjetas, renderiza el bloque de Gráficos Operativos (`.charts-grid`):<br>- **Gráfico 1 (Stock por Categoría):** Gráfico de barras de Recharts con un degradado vertical rojo oscuro (`stopColor` de `#dc2626` a `#991b1b`).<br>- **Gráfico 2 (Estado del Stock):** Gráfico de torta (PieChart) circular dividido en color verde brillante (`Normal`), amarillo (`Bajo`) y rojo (`Crítico`) con sus porcentajes y una leyenda descriptiva. |
| 5 | | En la parte inferior, el sistema dibuja:<br>- **Movimientos de la Semana:** Gráfico de líneas (LineChart) con curvas de Entradas en color verde (`#10b981`) y Salidas en color rojo (`#ef4444`).<br>- **Top 5 Medicamentos por Valor:** Gráfico de barras horizontales con degradado rojo intenso.<br>- **Alertas Críticas:** Lista con el detalle cronológico de las alarmas activas.<br>- **Estadísticas Rápidas:** Cuadro con contadores rápidos de movimientos y vencimientos. |
| 6 | El usuario analiza los gráficos operativos de stock e ingresos del almacén. | |

---

### Curso normal de eventos – Consultar Analytics Inteligente (ML/IA)

| # | Usuario | Sistema |
|---|---|---|
| 1 | El usuario hace clic en la opción "Analytics Inteligente" del menú lateral vertical (Sidebar). | |
| 2 | | El sistema carga la interfaz gráfica del módulo **🧠 Analytics Inteligente** en el área de contenido principal. |
| 3 | | El sistema renderiza en primer lugar las tres Tarjetas de Insights Analíticos (`.insight-grid`):<br>- **Insight del Día (Morada):** "✦ Insight del Día: Se detectó un aumento del 22% en la demanda de antiinflamatorios..."<br>- **Tendencia General (Azul):** "↗ Tendencia General: El consumo presenta una tendencia alcista del 8.5%..."<br>- **Alerta Predictiva (Naranja):** "⊕ Alerta Predictiva: X medicamentos alcanzarán stock crítico en los próximos 30 días..." |
| 4 | | Debajo de las tarjetas, el sistema renderiza el bloque de Gráficos de Inteligencia Artificial:<br>- **Predicción de Demanda (IA):** Un gráfico de área avanzada (AreaChart) de Recharts. Muestra la curva de datos reales pasados en color rojo vivo, y dibuja la curva de predicción computada a futuro como una línea segmentada de color morado brillante (`#8b5cf6`) rellena con un degradado morado translúcido.<br>- **Comparativa Mensual:** Gráfico de barras agrupadas comparando Ventas (verde) contra Compras (rojo) mes a mes. |
| 5 | | En la parte inferior de la pantalla, renderiza el bloque de Recomendaciones de Compra:<br>- **Tendencias de Consumo:** Tabla dinámica indicando el porcentaje de cambio por categoría de fármaco con íconos de subida/bajada.<br>- **Predicciones Críticas:** Tarjetas informativas de productos en riesgo inminente de desabastecimiento, incluyendo su stock actual, la fecha estimada de quiebre y un botón inteligente de acción rápida: "💡 Ordenar X unidades" (ej. "💡 Ordenar 350 unidades"). |
| 6 | El usuario examina las recomendaciones e insights generados por el modelo analítico de Machine Learning para tomar decisiones de abastecimiento estratégico. | |

---

### Flujo alterno 1 – Pérdida de conexión con el modelo predictivo de IA/ML

| # | Usuario | Sistema |
|---|---|---|
| 1 | El usuario accede al módulo "Analytics Inteligente" cuando el servicio backend o el servidor de machine learning se encuentra desconectado. | |
| 2 | | El sistema realiza la petición `api.getAnalytics()`. Al fallar la respuesta de la red, el backend no retorna las matrices de predicción de demanda ni los insights correspondientes. |
| 3 | | El sistema intercepta la falta de datos y detiene la carga ordinaria. |
| 4 | | El sistema oculta las tarjetas e insights y dibuja en el centro de la pantalla una alerta visual destacada en texto rojo: "Error al cargar datos. Compruebe la conexión con el servidor analítico de Machine Learning." |
| 5 | El personal lee el aviso de error e informa de inmediato al Administrador de sistemas para reanudar el microservicio de predicción. | |
