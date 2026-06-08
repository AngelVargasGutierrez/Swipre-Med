# UC-001 – Iniciar Sesión

## a) UC-001 – Iniciar Sesión

| Campo | Detalle |
|---|---|
| **Caso de uso** | UC-001 – Iniciar Sesión |
| **Actores** | Personal del Hospital (Administrador, Jefatura, Farmacia) |
| **Propósito** | Permitir al personal autenticarse en MOPGIMED y acceder a los módulos según su cargo asignado. |
| **Tipo** | Obligatorio (X) / Opcional ( ) |
| **Requisito ID (RF)** | RF-001 |
| **Versión** | 1.0 |
| **Descripción** | El sistema valida las credenciales ingresadas y otorga acceso a los módulos según el cargo: **Administrador:** acceso completo + gestión de usuarios. **Jefatura:** reportes, análisis IA e indicadores. **Farmacia:** inventario, medicamentos y alertas. |
| **Precondición** | El usuario debe estar registrado y con estado "Activo" en la base de datos del sistema. |
| **Postcondición** | Sesión iniciada correctamente. El sistema redirige al Panel Principal según el cargo y registra el ingreso en el Historial de Actividad. |

---

### Curso normal de eventos

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal ingresa la ruta del sistema MOPGIMED en su navegador web. | |
| 2 | | El sistema carga la interfaz gráfica y muestra la **Pantalla de Inicio de Sesión**. El diseño presenta un fondo de pantalla ocupando toda la ventana con un degradado suave que va de tonos rosados claro en la parte superior a rojizos en la parte inferior. En el centro exacto de la pantalla se despliega una tarjeta blanca flotante con bordes fuertemente redondeados y una sombra sutil para darle relieve. |
| 3 | | Dentro de la tarjeta blanca, en la parte superior central, el sistema muestra el isotipo de la aplicación: un cuadrado color rojo vivo con esquinas redondeadas que contiene en su interior un ícono de triángulo de advertencia delineado en blanco. |
| 4 | | Inmediatamente debajo del isotipo, el sistema muestra el texto "**MOPGIMED**" en letras mayúsculas, tamaño grande, negrita y color rojo oscuro. Debajo de este, muestra el subtítulo "Sistema de Gestión de Inventario Farmacéutico" en una fuente gris más pequeña y delgada. |
| 5 | | Debajo del encabezado del logo, el sistema muestra el título de la sección "**Iniciar Sesión**" alineado a la izquierda, en texto oscuro y tamaño mediano-grande. |
| 6 | | A continuación, el sistema despliega el formulario de ingreso con dos secciones verticales:<br>1. La etiqueta "Usuario" en texto oscuro pequeño, seguida de una caja de texto con fondo blanco y borde gris claro.<br>2. La etiqueta "Contraseña", seguida de una caja de texto similar que muestra el texto guía (placeholder) "Ingrese su contraseña" y contiene el ícono de un ojo en el extremo derecho (para mostrar/ocultar los caracteres). |
| 7 | | Debajo de los campos, el sistema renderiza un botón ancho que ocupa todo el largo del formulario. Este botón tiene un color de fondo degradado rojo oscuro y muestra el texto "Iniciar Sesión" centrado, en color blanco y negrita. |
| 8 | | En la parte inferior de la tarjeta blanca, el sistema renderiza un recuadro rectangular de fondo rosado claro con un borde rojo muy fino. Dentro de este recuadro se encuentra el texto "Credenciales de prueba:" y debajo una lista de los roles del sistema (Admin, Farmacia, Jefatura, Logística) emparejados con sus respectivos usuarios y contraseñas escritos en una fuente de color rojo tipo consola (monospace). |
| 9 | El personal hace clic en el campo "Usuario" e ingresa su nombre de usuario asignado. | |
| 10 | El personal hace clic en el campo "Contraseña" e ingresa su clave personal. | |
| 11 | El personal presiona el botón rojo "Iniciar Sesión". | |
| 12 | | El sistema recibe los datos, consulta la base de datos y verifica que el usuario existe, la contraseña es correcta y el estado de la cuenta es "Activo". |
| 13 | | El sistema identifica el rol del usuario que está intentando ingresar (Administrador, Logística, Jefatura de Farmacia o Caja Farmacia). |
| 14 | | Tras la validación exitosa, el sistema cierra la vista de Login y redirige automáticamente a la vista principal: el **Dashboard**. |
| 15 | | El sistema carga la estructura de la interfaz del Dashboard. A la izquierda, despliega una barra de navegación vertical (Sidebar) ancha, con un fondo degradado de color rojo muy oscuro a rojo vivo. En la parte superior de esta barra muestra el logo, y debajo muestra un recuadro oscurecido con el texto "Hola,", seguido del Nombre Completo del usuario en blanco y su Rol en texto rojo claro. |
| 16 | | Según el rol identificado, el sistema construye y muestra distintos botones de navegación en esta barra lateral roja:<br><br>**- Si es Administrador:** El sistema muestra los botones para Dashboard, Medicamentos, Inventario, Notificaciones, Reportes, Analytics Inteligente y Usuarios.<br>**- Si es Logística:** El sistema muestra los botones para Dashboard, Medicamentos, Inventario, Notificaciones, Reportes y Analytics Inteligente.<br>**- Si es Jefatura de Farmacia:** El sistema muestra los botones para Dashboard, Inventario, Notificaciones, Reportes y Analytics Inteligente.<br>**- Si es Caja Farmacia:** El sistema muestra únicamente los botones para Dashboard y Medicamentos. |
| 17 | | En el área principal derecha (que ocupa el resto de la pantalla y tiene fondo claro), el sistema carga el contenido del módulo "Dashboard". Lo primero que el usuario ve es un encabezado con el título "Resumen del Sistema" y debajo una cuadrícula horizontal con 4 Tarjetas de Estadísticas (Stat Cards) blancas con bordes redondeados. Cada tarjeta tiene un ícono de color (rojo, verde, amarillo), un número grande en negrita (ej. cantidad de medicamentos) y una breve descripción debajo. |
| 18 | El personal visualiza su panel personalizado y comienza a interactuar con los módulos permitidos según su rol. | |

---

### Flujo alterno 1 – Credenciales incorrectas

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal ingresa un usuario que no existe o una contraseña que no coincide con la registrada. | |
| 2 | El personal presiona el botón "Iniciar Sesión". | |
| 3 | | El sistema envía las credenciales al Verificador de Identidad. |
| 4 | | El Verificador consulta el Registro del Personal y no encuentra coincidencia con las credenciales ingresadas. |
| 5 | | El sistema descarta el intento de acceso para proteger la seguridad del sistema. |
| 6 | | El sistema limpia automáticamente el campo de contraseña. |
| 7 | | El sistema muestra el aviso: "Usuario o contraseña incorrectos. Verifique sus datos e intente de nuevo." |
| 8 | El personal lee el aviso, corrige sus credenciales e intenta acceder nuevamente. | |

---

### Flujo alterno 2 – Usuario Inactivo

| # | Usuario | Sistema |
|---|---|---|
| 1 | El personal ingresa sus credenciales correctas, pero su cuenta fue desactivada por el Administrador. | |
| 2 | El personal presiona el botón "Iniciar Sesión". | |
| 3 | | El sistema encuentra el usuario y verifica que las credenciales son correctas. |
| 4 | | El sistema detecta que el campo Estado del usuario tiene el valor "Inactivo". |
| 5 | | El sistema bloquea el acceso aunque las credenciales sean válidas. |
| 6 | | El sistema limpia el campo de contraseña. |
| 7 | | El sistema muestra el aviso: "Su cuenta está inactiva. Comuníquese con el Administrador del sistema." |
| 8 | El personal no puede ingresar hasta que el Administrador reactive su cuenta en el sistema. | |
