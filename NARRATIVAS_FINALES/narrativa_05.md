# UC-005 – Registrar Medicamento Nuevo con Asistencia IA

## a) UC-005 – Registrar Medicamento Nuevo con Asistencia IA

| Campo | Detalle |
|---|---|
| **Caso de uso** | UC-005 – Registrar Medicamento Nuevo con Asistencia IA |
| **Actores** | Personal de Farmacia, Almacenero, Administrador |
| **Propósito** | Permitir registrar un medicamento completamente nuevo en el catálogo del sistema utilizando la caja de asistencia de IA para autocompletar laboratorios y sugerir categorías. |
| **Tipo** | Obligatorio (X) / Opcional ( ) |
| **Requisito ID (RF)** | RF-005 |
| **Versión** | 1.0 |
| **Descripción** | El sistema provee un asistente inteligente que sugiere nombres y categorías durante la catalogación de una nueva patente médica. Si el producto no existe, permite al personal escribir libremente los datos para dar de alta tanto la ficha técnica del medicamento en el catálogo como su primer lote físico. |
| **Precondición** | El usuario debe estar autenticado en MOPGIMED y contar con permisos de edición de catálogo. |
| **Postcondición** | El nuevo medicamento se añade al catálogo general y queda disponible para futuras consultas y movimientos de inventario. |

---

### Curso normal de eventos

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal hace clic en el botón "Nuevo Medicamento" (+) ubicado en la parte superior derecha del listado principal de medicamentos. | |
| 2 | | El sistema carga la interfaz gráfica de **Registro Rápido de Medicamento** en el área principal. |
| 3 | | Muestra en primer plano la sección de "**Búsqueda Inteligente con IA**" (`.ai-card`) con fondo degradado rosa suave. |
| 4 | El personal hace clic en "Paso 1: Selecciona el Laboratorio *" y busca el fabricante en la lista. Al notar que es un laboratorio nuevo que no figura en la base de datos, el personal deja el campo en blanco y decide registrarlo de forma manual directa. | |
| 5 | | Al no seleccionar un laboratorio preexistente, el sistema mantiene el Step 2 inhabilitado pero deja completamente editables y abiertos los campos de la sección inferior "Información Básica". |
| 6 | El personal hace clic en el campo "Nombre del Medicamento *" y digita el nombre completo de la nueva patente (ej. "Ibuprofeno Forte 800mg"). | |
| 7 | El personal hace clic en el campo "Laboratorio *" (que está vacío y editable) y digita el nombre del nuevo fabricante (ej. "Laboratorio Internacional S.A."). | |
| 8 | El personal hace clic en el selector "Categoría *" y escoge la categoría adecuada (ej. "Antiinflamatorios") de la lista precargada. | |
| 9 | El personal se desplaza a la tarjeta de "**Completa estos datos manualmente**" y digita el costo unitario de compra (ej. "0.30") y el precio de venta sugerido (ej. "0.90"). | |
| 10 | El personal introduce el stock de seguridad mínimo (ej. "50") y el stock inicial del lote ingresado (ej. "200"). | |
| 11 | El personal introduce el código único de lote (ej. "IBU-800-001") y selecciona la fecha de vencimiento. | |
| 12 | El personal digita el Registro Sanitario oficial correspondiente. | |
| 13 | El personal presiona el botón rojo "📋 Registrar Medicamento". | |
| 14 | | El sistema valida que el nombre del medicamento no esté registrado previamente para evitar duplicados en el catálogo. |
| 15 | | El sistema crea un código de inventario único (`FARM-` seguido del timestamp del sistema, ej. `FARM-1716232514000`) para catalogar de forma inequívoca el nuevo medicamento. |
| 16 | | El sistema formatea la fecha de vencimiento e inserta el medicamento en la tabla de base de datos junto con su correspondiente lote inicial. |
| 17 | | El Registrador de Actividad inserta en el Historial de Acciones la creación del nuevo medicamento "Ibuprofeno Forte 800mg". |
| 18 | | El sistema muestra un aviso emergente: "✅ Medicamento registrado exitosamente." y redirige al usuario de vuelta al listado del inventario. |

---

### Flujo alterno 1 – Medicamento ya catalogado (Evita duplicados)

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal digita un nombre de medicamento que ya está registrado para ese mismo laboratorio. | |
| 2 | El personal hace clic en el botón "📋 Registrar Medicamento". | |
| 3 | | El backend procesa la petición y detecta que la combinación de Nombre y Laboratorio ya existe en la base de datos MySQL (violación de clave única). |
| 4 | | El sistema bloquea el registro y responde con un mensaje de alerta: "Error: El medicamento ya se encuentra registrado en el catálogo. Utilice la opción de registrar lote existente." |
| 5 | El personal lee la alerta, hace clic en "Aceptar", cancela la acción y regresa a la pantalla principal para buscar el medicamento y registrar el lote en su ficha respectiva. | |
