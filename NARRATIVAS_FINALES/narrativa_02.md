# UC-002 – Gestionar Usuarios

## b) UC-002 – Gestionar Usuarios

| Campo | Detalle |
|---|---|
| **Caso de uso** | UC-002 – Gestionar Usuarios |
| **Actores** | Administrador |
| **Propósito** | Permitir al Administrador registrar nuevos usuarios del sistema, consultar los existentes, modificar su información y habilitar o deshabilitar cuentas para controlar correctamente los accesos a MOPGIMED. |
| **Tipo** | Obligatorio (X) / Opcional ( ) |
| **Requisito ID (RF)** | RF-002 |
| **Versión** | 1.0 |
| **Descripción** | El sistema permite al Administrador gestionar de forma completa las cuentas de acceso al sistema. Puede registrar nuevos usuarios ingresando su nombre completo, nombre de usuario, contraseña, cargo y rol. También puede consultar la lista de usuarios activos e inactivos, editar su información y cambiar su estado. Toda acción sobre usuarios queda registrada en el Historial de Actividad. |
| **Precondición** | El Administrador debe haber iniciado sesión correctamente en MOPGIMED con rol Administrador. |
| **Postcondición** | El usuario queda registrado, actualizado, habilitado o deshabilitado en la base de datos del sistema. La acción queda registrada en el Historial de Actividad. |

---

### Curso normal de eventos – Consultar usuarios

| # | Usuario | Sistema |
|---|---|---|
| 1 | El Administrador hace clic en la opción "Usuarios" del menú lateral izquierdo. | |
| 2 | | El sistema carga la interfaz gráfica del módulo de "Gestión de Usuarios" en el área principal derecha de fondo claro. |
| 3 | | El sistema muestra un encabezado superior. A la izquierda, el título "Gestión de Usuarios" en tamaño grande, letra oscura y negrita, acompañado debajo por el subtítulo "Administración de usuarios y permisos del sistema" en texto gris pequeño. A la derecha, muestra un botón rojo oscuro con el texto "Nuevo Usuario" acompañado del ícono del signo más (+). |
| 4 | | Debajo del encabezado, el sistema renderiza una tarjeta blanca rectangular con bordes redondeados y sombra sutil que contiene una tabla de datos. La cabecera de la tabla tiene un fondo rosado muy pálido con borde inferior rojo claro, y los títulos de las columnas en letras mayúsculas oscuras: "Usuario", "Email", "Rol", "Estado", "Fecha Creación" y "Acciones". |
| 5 | | El sistema llena la tabla con los usuarios registrados, mostrando el Nombre en negrita y el "username" debajo en texto gris más pequeño. En la columna "Rol", el sistema muestra etiquetas redondeadas (badges) de colores distintivos según el cargo: Morado para Administrador, Rojo para Farmacia, Verde para Jefatura, y Amarillo/Naranja para Logística. |
| 6 | | En la columna "Estado", el sistema muestra una etiqueta verde brillante si está "Activo", o una etiqueta gris claro si está "Inactivo". |
| 7 | | En la columna "Acciones", el sistema muestra dos botones pequeños cuadrados (icon-btns). El primero es un botón verde/celeste claro con un ícono de lápiz para Editar. El segundo es un botón rojo claro con el ícono de un usuario tachado (UserX) si la cuenta está activa, o verde claro si está inactiva. |
| 8 | | En la parte inferior de la pantalla, debajo de la tabla principal, el sistema muestra una segunda tarjeta blanca titulada "↗ Historial de Acciones", que contiene una tabla con las columnas: "Fecha / Hora", "Usuario", "Acción", "Módulo" y "Detalles", mostrando las últimas modificaciones hechas por el Administrador. |
| 9 | El Administrador visualiza y analiza la información de todos los usuarios registrados y sus respectivos historiales. | |

---

### Curso normal de eventos – Registrar nuevo usuario

| # | Usuario | Sistema |
|---|---|---|
| 1 | El Administrador hace clic en el botón rojo "Nuevo Usuario" ubicado arriba a la derecha. | |
| 2 | | El sistema despliega una ventana emergente (Modal) flotante sobre la pantalla. El fondo de toda la pantalla se oscurece (`rgba(0,0,0,0.45)`) centrando la atención en un recuadro blanco fuertemente redondeado. |
| 3 | | En la parte superior del recuadro, el sistema muestra el título "Nuevo Usuario" alineado a la izquierda en negrita oscura y un botón con el ícono de una 'X' gris a la derecha para cerrar la ventana. |
| 4 | | A continuación, el sistema muestra el formulario apilado verticalmente. Cada campo tiene su etiqueta superior en texto pequeño oscuro y una caja de texto blanca con borde gris que se torna roja al hacerle clic. Los campos son: "Nombre completo *", "Nombre de usuario *", "Contraseña *", "Rol *" (un menú desplegable) y "Email". |
| 5 | | Al final del recuadro blanco, alineados a la derecha, el sistema muestra dos botones: un botón gris claro con texto oscuro llamado "Cancelar" y un botón degradado rojo oscuro llamado "Crear usuario". |
| 6 | El Administrador rellena los campos de texto con el nombre, el usuario, la contraseña, un email válido y selecciona el rol del menú desplegable. | |
| 7 | El Administrador presiona el botón rojo "Crear usuario". | |
| 8 | | El sistema valida que los campos no estén vacíos. Si todo es correcto, envía los datos a la base de datos y crea la cuenta. |
| 9 | | El sistema registra automáticamente en la tabla del Historial de Acciones la creación del usuario. |
| 10 | | El sistema cierra la ventana flotante (Modal) de forma automática y recarga la tabla de fondo, mostrando la nueva fila con los datos del usuario recién ingresado. |

---

### Curso normal de eventos – Editar usuario

| # | Usuario | Sistema |
|---|---|---|
| 1 | El Administrador busca en la tabla al usuario que desea modificar y hace clic en el botón con el ícono del Lápiz en la columna de Acciones. | |
| 2 | | El sistema oscurece el fondo y abre la ventana flotante (Modal) blanca, pero esta vez con el título "Editar Usuario". |
| 3 | | El sistema rellena automáticamente todos los campos del formulario con los datos existentes del usuario. El título del campo de contraseña cambia a "Contraseña (dejar vacío para no cambiar)". |
| 4 | El Administrador modifica el texto de uno o más campos (por ejemplo, cambiar el rol desplegable o corregir el nombre). | |
| 5 | El Administrador hace clic en el botón rojo "Guardar cambios". | |
| 6 | | El sistema valida los datos, actualiza la información en la base de datos y añade el registro correspondiente al Historial de Acciones. |
| 7 | | El sistema cierra el Modal y la tabla principal se actualiza mostrando inmediatamente los nuevos datos o el nuevo color de Rol asignado. |

---

### Curso normal de eventos – Cambiar estado de la cuenta (Activar/Desactivar)

| # | Usuario | Sistema |
|---|---|---|
| 1 | El Administrador localiza al usuario y hace clic en el segundo botón de la columna "Acciones" (ícono de UserX color rojo si está Activo, o verde si está Inactivo). | |
| 2 | | El sistema envía una petición rápida al servidor para alternar (toggle) el estado actual del usuario sin abrir ninguna ventana nueva. |
| 3 | | El sistema actualiza en tiempo real la fila correspondiente en la tabla: la etiqueta cambia visualmente de verde brillante a gris (si lo desactivó), y el botón de acción cambia su color de rojo a verde brillante. |
| 4 | | El sistema añade inmediatamente el cambio en la tabla inferior del Historial de Acciones detallando el ID del usuario modificado. |

---

### Flujo alterno 1 – Datos incompletos

| # | Usuario | Sistema |
|---|---|---|
| 1 | El Administrador rellena el formulario pero olvida ingresar el Nombre o el Nombre de usuario. | |
| 2 | El Administrador presiona "Crear usuario" o "Guardar cambios". | |
| 3 | | El sistema detecta que faltan campos obligatorios y bloquea la acción. |
| 4 | | El sistema muestra un mensaje de alerta visual en la parte superior del formulario (dentro del cuadro blanco) con fondo rosado, letras rojo oscuro y bordes redondeados indicando: "Nombre y usuario son obligatorios." o "La contraseña es obligatoria al crear un usuario." |
| 5 | El Administrador lee el mensaje en color rojo, completa los campos faltantes y vuelve a intentar. | |
