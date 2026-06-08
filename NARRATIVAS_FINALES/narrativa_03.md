# UC-003 – Visualizar Historial de Acciones

## c) UC-003 – Visualizar Historial de Acciones

| Campo | Detalle |
|---|---|
| **Caso de uso** | UC-003 – Visualizar Historial de Acciones |
| **Actores** | Administrador, Jefatura |
| **Propósito** | Permitir al personal autorizado consultar el registro de todas las actividades realizadas por los usuarios dentro del sistema MOPGIMED para fines de control y seguimiento. |
| **Tipo** | Obligatorio (X) / Opcional ( ) |
| **Requisito ID (RF)** | RF-003 |
| **Versión** | 1.0 |
| **Descripción** | El sistema mantiene un Historial de Actividad donde se registra automáticamente cada acción realizada: inicios de sesión, creación, edición y eliminación de medicamentos, gestión de usuarios, generación de reportes y cualquier otra operación relevante. El personal autorizado puede consultar este historial, aplicar filtros por usuario, tipo de acción, fecha o módulo, y ver el detalle completo de cada evento. El historial es de solo lectura; ningún usuario puede modificar ni eliminar los registros generados. |
| **Precondición** | El usuario debe haber iniciado sesión en MOPGIMED con rol Administrador o Jefatura. Deben existir registros previos de actividad en la base de datos. |
| **Postcondición** | El usuario visualiza el historial filtrado según los criterios seleccionados. No se realiza ningún cambio en la base de datos. |

---

### Curso normal de eventos

| # | Usuario | Sistema |
|---|---|---|
| 1 | El Administrador hace clic en la opción "Usuarios" del menú lateral izquierdo (Sidebar rojo oscuro). | |
| 2 | | El sistema carga el módulo principal en el lado derecho de la pantalla con fondo claro. |
| 3 | | En la parte inferior del módulo, el sistema renderiza una tarjeta rectangular de fondo completamente blanco con bordes fuertemente redondeados y una sombra suave a su alrededor. |
| 4 | | En la parte superior de esta tarjeta blanca, el sistema muestra el título "**↗ Historial de Acciones**" en texto oscuro y negrita, acompañado por un pequeño ícono de flecha apuntando hacia arriba a la derecha. |
| 5 | | Debajo del título, el sistema despliega una tabla de datos. La cabecera de esta tabla tiene un fondo rosado muy sutil y una línea roja delgada en su borde inferior. Los encabezados de las columnas están en letras mayúsculas oscuras y alineadas a la izquierda: "Fecha / Hora", "Usuario", "Acción", "Módulo" y "Detalles". |
| 6 | | El sistema consulta la base de datos, extrae las acciones registradas cronológicamente y comienza a llenar las filas de la tabla con la siguiente estructura visual: |
| 7 | | - **Columna "Fecha / Hora":** El sistema muestra la fecha exacta (ej. 19/05/2026, 12:45 PM) en texto gris oscuro y tamaño pequeño (`12px`). |
| 8 | | - **Columna "Usuario":** El sistema muestra el nombre de la persona responsable de la acción en texto oscuro fuertemente remarcado en negrita. |
| 9 | | - **Columna "Acción":** El sistema muestra el texto de la operación realizada en tamaño estándar (ej. "Creó usuario", "Actualizó usuario", "Deshabilitó usuario"). |
| 10 | | - **Columna "Módulo":** El sistema renderiza una etiqueta redondeada (badge tipo píldora) de colores dinámicos: azul claro para Medicamentos, verde claro para Inventario, morado claro para Reportes, o gris claro para otros, con el texto en color oscuro. |
| 11 | | - **Columna "Detalles":** El sistema muestra una descripción final del suceso (ej. "Usuario Creado: logistica") en color gris (`#64748b`) y tamaño de letra 13. |
| 12 | El Administrador se desplaza (scroll) por la tabla para visualizar y auditar todas las operaciones pasadas, verificando quién modificó los accesos y a qué hora exacta. | |
| 13 | | Al ser una vista de auditoría, el sistema bloquea cualquier tipo de edición en esta tabla, manteniéndola estrictamente como un registro de lectura. |

---

### Flujo alterno 1 – Historial vacío (Aún no hay acciones)

| # | Usuario | Sistema |
|---|---|---|
| 1 | El Administrador accede por primera vez al módulo tras instalar el sistema. | |
| 2 | | El sistema intenta recuperar registros de la base de datos pero la consulta devuelve un arreglo vacío. |
| 3 | | El sistema renderiza la tarjeta blanca del "Historial de Acciones" y muestra las cabeceras de las columnas, pero debajo de ellas el espacio de la tabla aparece vacío (sin filas). |
| 4 | El Administrador comprueba que el historial está limpio y procede a realizar la primera acción en el sistema para generar un registro. | |
