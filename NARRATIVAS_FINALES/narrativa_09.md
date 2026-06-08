# UC-009 – Modificar Medicamento

## a) UC-009 – Modificar Medicamento

| Campo | Detalle |
|---|---|
| **Caso de uso** | UC-009 – Modificar Medicamento |
| **Actores** | Personal de Logística, Jefatura de Farmacia, Administrador |
| **Propósito** | Permitir al personal autorizado corregir errores de digitación o actualizar la información técnica, descriptiva y de control de un medicamento registrado en el catálogo. |
| **Tipo** | Obligatorio (X) / Opcional ( ) |
| **Requisito ID (RF)** | RF-009 |
| **Versión** | 1.0 |
| **Descripción** | El sistema permite abrir un formulario de edición para cualquier medicamento seleccionado de la lista. Tras modificar los campos técnicos (tales como precio de venta, costo unitario, stock mínimo o número de lote) y presionar "Guardar cambios", el sistema realiza la actualización en la base de datos MySQL, recalculando el estado de stock (semáforo) en tiempo real y registrando el movimiento de auditoría. |
| **Precondición** | El usuario debe estar autenticado en MOPGIMED con permisos de edición (Logística, Jefatura o Administrador) y el medicamento debe estar registrado previamente. |
| **Postcondición** | La ficha del medicamento se actualiza en la base de datos MySQL, refrescando inmediatamente la información en las tablas y pantallas del sistema. |

---

### Curso normal de eventos

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal autorizado localiza el medicamento a modificar en la tabla principal del módulo "Medicamentos". | |
| 2 | El personal hace clic en el botón de acción con el ícono del Lápiz (✏️) en la columna "Acciones" de la fila seleccionada. | |
| 3 | | El sistema oscurece el fondo de la pantalla con una capa de color oscuro translúcido (`rgba(0,0,0,0.45)`) y abre una ventana modal emergente con bordes fuertemente redondeados y sombra suave. |
| 4 | | El sistema titula la ventana modal como "Editar Medicamento" y rellena automáticamente todos los campos del formulario con los valores existentes del registro (ej. Nombre, Laboratorio, Categoría, Costo, Precio de Venta, Stock Mínimo, Lote, Fecha de Vencimiento y Registro Sanitario). |
| 5 | El personal modifica los campos que requieran corrección (ej. cambia el Precio de Venta de "$0.50" a "$0.65" y el Stock Mínimo de "100" a "150"). | |
| 6 | El personal hace clic en el botón rojo degradado "Guardar cambios" ubicado en la parte inferior derecha del formulario modal. | |
| 7 | | El sistema valida que los datos numéricos modificados sean correctos (valores positivos superiores a cero) y que los campos requeridos no hayan sido vaciados. |
| 8 | | El sistema realiza una llamada a la API backend enviando los datos actualizados. La API procesa la actualización y ejecuta el query `UPDATE` en la tabla correspondiente de la base de datos MySQL. |
| 9 | | El sistema recalcula en tiempo real el estado de stock (Normal, Bajo o Crítico) comparando el stock actual con el nuevo stock mínimo establecido ("150"). |
| 10 | | El Registrador de Actividad guarda automáticamente la modificación en el Historial de Acciones indicando qué usuario modificó la ficha técnica y a qué hora exacta. |
| 11 | | El sistema cierra la ventana flotante (Modal) de forma automática y actualiza de inmediato la fila en la tabla principal del módulo "Medicamentos", mostrando el nuevo precio y el color de Badge de Estado actualizado. |

---

### Flujo alterno 1 – Campos obligatorios vaciados

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal borra por error todo el texto del campo obligatorio "Nombre del Medicamento" o "Categoría". | |
| 2 | El personal hace clic en el botón "Guardar cambios". | |
| 3 | | El sistema detecta que faltan campos obligatorios requeridos y bloquea el guardado. |
| 4 | | El sistema muestra un aviso de error visual en la cabecera del formulario modal con fondo rosado claro, letras rojo oscuro y bordes redondeados indicando: "El nombre del medicamento y la categoría son obligatorios." |
| 5 | El personal lee el aviso de error en color rojo, completa nuevamente el campo vacío con información válida y vuelve a intentar. | |
