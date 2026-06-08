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
| 1 | El personal abre el sistema MOPGIMED en su navegador. | |
| 2 | | El sistema muestra la Pantalla de Inicio de Sesión con los campos Usuario y Contraseña. |
| 3 | El personal hace clic en el campo "Usuario" e ingresa su nombre de usuario asignado.El personal hace clic en el campo "Usuario" e ingresa su nombre de usuario asignado. | |
| 4 | El personal hace clic en el campo "Contraseña" e ingresa su contraseña personal. | |
| 5 | El personal presiona el botón "Iniciar Sesión". | |
| 6 | | El sistema recibe los datos del formulario y los envía al Verificador de Identidad. |
| 7 | | El sistema muestra un indicador de carga mientras procesa la solicitud. |
| 8 | | El Verificador consulta el Registro del Personal buscando el nombre de usuario ingresado. |
| 9 | | El sistema comprueba que la contraseña ingresada coincida con la almacenada en el registro. |
| 10 | | El sistema verifica que el campo Estado del usuario sea "Activo". |
| 11 | | El sistema identifica el cargo del usuario (Administrador, Jefatura o Farmacia). |
| 12 | | El sistema consulta los permisos y opciones de menú correspondientes al cargo identificado. |
| 13 | | El sistema carga el conjunto de módulos y funcionalidades disponibles para ese cargo. |
| 14 | | El Registrador de Actividad guarda en el Historial: nombre del usuario, cargo, fecha y hora exacta del ingreso. |
| 15 | | El sistema cierra la Pantalla de Inicio de Sesión. |
| 16 | | El sistema muestra el Panel Principal con el menú personalizado según el cargo del usuario. |
| 17 | El personal visualiza su panel con los módulos disponibles y los indicadores de inventario activos. | |
| 18 | El personal comienza a utilizar MOPGIMED con las funcionalidades correspondientes a su cargo. | |

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
