# Narrativas de casos de uso — alineadas al diagrama de casos de uso MOPGIMED
# Formato: metadata (tabla 2 cols) + cursos normales/alternos (tabla Usuario|Sistema)

def _uc(uid, nombre, actores, proposito, rf, descripcion, pre, post, cursos, alternos=None):
    return {
        "id": uid, "nombre": nombre, "actores": actores, "proposito": proposito,
        "rf": rf, "descripcion": descripcion, "precondicion": pre, "postcondicion": post,
        "cursos": cursos, "alternos": alternos or [],
    }


def _curso(titulo, pasos):
    return {"titulo": titulo, "pasos": pasos}


def _paso(usuario="", sistema=""):
    return (usuario, sistema)


NARRATIVAS = [
    _uc(
        "UC-001", "Iniciar Sesión",
        "Usuario (Administrador, Jefatura, Farmacia / Almacén)",
        "Permitir al usuario autenticarse en el sistema y acceder a las funcionalidades según su rol.",
        "RF-001",
        "El sistema valida las credenciales ingresadas y otorga acceso a los módulos según el rol: "
        "**Administrador:** acceso completo y gestión de usuarios. **Jefatura:** reportes, inventario, "
        "dashboard y análisis. **Farmacia / Almacén:** medicamentos, registro de lotes y consultas operativas.",
        "El usuario debe estar registrado y con estado Activo en la base de datos.",
        "Sesión iniciada correctamente. El sistema redirige al panel principal según el rol del usuario "
        "y registra el ingreso en el historial de actividad.",
        [_curso("Curso normal de eventos", [
            _paso("El personal abre el sistema MOPGIMED en su navegador."),
            _paso("", "El sistema muestra la Pantalla de Inicio de Sesión con los campos Usuario y Contraseña."),
            _paso("El personal ingresa su nombre de usuario y contraseña."),
            _paso("El personal presiona el botón Iniciar Sesión."),
            _paso("", "El sistema envía las credenciales al Verificador de Identidad."),
            _paso("", "El Verificador consulta el Registro del Personal."),
            _paso("", "El sistema comprueba la contraseña y que el estado del usuario sea Activo."),
            _paso("", "El sistema identifica el rol y carga el menú de módulos correspondiente."),
            _paso("", "El Registrador de Actividad guarda el ingreso en el Historial."),
            _paso("", "El sistema muestra el Panel Principal personalizado según el rol."),
            _paso("El personal accede a los módulos habilitados para su perfil."),
        ])],
        [
            ("Flujo alterno 1 – Credenciales incorrectas", [
                _paso("El personal ingresa credenciales inválidas y presiona Iniciar Sesión."),
                _paso("", "El Verificador no encuentra coincidencia válida."),
                _paso("", "El sistema muestra: Usuario o contraseña incorrectos."),
                _paso("El personal corrige los datos e intenta nuevamente."),
            ]),
            ("Flujo alterno 2 – Usuario inactivo", [
                _paso("El personal ingresa credenciales correctas de una cuenta Inactiva."),
                _paso("", "El sistema bloquea el acceso."),
                _paso("", "El sistema muestra: Su cuenta está inactiva. Comuníquese con el Administrador."),
            ]),
        ],
    ),
    _uc(
        "UC-002", "Gestionar Usuario",
        "Administrador",
        "Permitir al Administrador registrar, consultar, modificar y activar o desactivar usuarios del sistema, "
        "asignando el rol desde el mismo formulario de gestión.",
        "RF-002",
        "El Administrador administra las cuentas de acceso: creación con asignación de rol (Administrador, "
        "Farmacia o Jefatura), edición de datos, cambio de estado y consulta de la lista de usuarios. "
        "Asignar rol y modificar usuario son acciones incluidas en este caso de uso.",
        "El Administrador debe haber iniciado sesión con rol Administrador.",
        "El usuario queda registrado, actualizado o con estado modificado en la base de datos. "
        "La acción queda registrada en el historial de actividad.",
        [
            _curso("Curso normal de eventos – Consultar usuarios", [
                _paso("El Administrador accede al módulo Usuarios desde el menú lateral."),
                _paso("", "El sistema carga la tabla de usuarios con nombre, username, rol, estado y fecha de creación."),
                _paso("El Administrador revisa la lista de usuarios registrados."),
            ]),
            _curso("Curso normal de eventos – Registrar nuevo usuario", [
                _paso("El Administrador hace clic en Nuevo Usuario."),
                _paso("", "El sistema abre el formulario modal con campos: nombre, username, contraseña, rol y email."),
                _paso("El Administrador completa los datos y selecciona el rol."),
                _paso("El Administrador hace clic en Guardar."),
                _paso("", "El sistema valida campos obligatorios y unicidad del username."),
                _paso("", "El sistema inserta el usuario con estado Activo."),
                _paso("", "El sistema registra la acción en el Historial y actualiza la tabla."),
            ]),
            _curso("Curso normal de eventos – Modificar usuario", [
                _paso("El Administrador hace clic en Editar sobre un usuario de la lista."),
                _paso("", "El sistema abre el formulario con los datos precargados."),
                _paso("El Administrador modifica los campos necesarios y guarda."),
                _paso("", "El sistema actualiza el registro y registra la acción en el Historial."),
            ]),
        ],
        [
            ("Flujo alterno – Username duplicado o datos incompletos", [
                _paso("El Administrador intenta guardar con datos inválidos."),
                _paso("", "El sistema muestra mensaje de error y no guarda los cambios."),
            ]),
            ("Flujo alterno – Activar o desactivar usuario", [
                _paso("El Administrador hace clic en el control de estado del usuario."),
                _paso("", "El sistema alterna entre Activo e Inactivo."),
                _paso("", "El sistema registra Activó usuario o Desactivó usuario en el Historial."),
            ]),
        ],
    ),
    _uc(
        "UC-003", "Visualizar Historial de Acciones",
        "Administrador",
        "Permitir consultar el registro de actividades realizadas en el sistema para auditoría y control.",
        "RF-003",
        "El sistema muestra en la sección inferior del módulo Usuarios el historial de acciones: "
        "fecha, usuario, acción, módulo y detalle. Los registros se generan automáticamente al iniciar "
        "sesión o gestionar usuarios.",
        "El Administrador debe haber iniciado sesión.",
        "El Administrador visualiza el historial. No se modifican datos.",
        [_curso("Curso normal de eventos", [
            _paso("El Administrador accede al módulo Usuarios."),
            _paso("", "El sistema consulta la tabla historial_acciones ordenada por fecha descendente."),
            _paso("", "El sistema muestra la tabla Historial de Acciones debajo de la lista de usuarios."),
            _paso("El Administrador revisa las acciones registradas para auditoría."),
        ])],
        [("Flujo alterno – Sin registros", [
            _paso("El Administrador accede al historial sin registros previos."),
            _paso("", "El sistema muestra: Aún no hay acciones registradas en el sistema."),
        ])],
    ),
    _uc(
        "UC-004", "Gestionar Medicamentos",
        "Administrador, Almacenero",
        "Permitir administrar el catálogo de medicamentos del inventario desde el listado principal.",
        "RF-007",
        "El personal autorizado accede al módulo Medicamentos para visualizar el inventario completo, "
        "con código, nombre, laboratorio, stock, estado calculado y acciones de consulta. Incluye la "
        "navegación hacia el registro de nuevos medicamentos.",
        "El usuario debe haber iniciado sesión con permisos sobre medicamentos.",
        "El sistema muestra el listado actualizado de medicamentos.",
        [_curso("Curso normal de eventos", [
            _paso("El personal selecciona Medicamentos en el menú lateral."),
            _paso("", "El sistema carga todos los medicamentos desde la base de datos."),
            _paso("", "El sistema calcula y muestra el estado de stock (Normal, Bajo, Crítico) por fila."),
            _paso("El personal revisa el inventario y puede iniciar registro o consulta."),
        ])],
    ),
    _uc(
        "UC-005", "Buscar Medicamento con IA",
        "Administrador, Almacenero, Técnico de Farmacia",
        "Permitir buscar medicamentos por nombre, código, laboratorio o categoría con asistencia inteligente.",
        "RF-005",
        "En el módulo Medicamentos o en el formulario de registro, el sistema filtra en tiempo real "
        "mediante el buscador inteligente, mostrando coincidencias y sugerencias según el texto ingresado.",
        "Deben existir medicamentos registrados.",
        "El sistema muestra los resultados que coinciden con el criterio de búsqueda.",
        [_curso("Curso normal de eventos", [
            _paso("El personal accede al buscador inteligente del módulo Medicamentos."),
            _paso("El personal escribe el nombre, código o criterio de búsqueda."),
            _paso("", "El sistema filtra el listado en tiempo real por nombre, laboratorio y categoría."),
            _paso("", "El sistema muestra la cantidad de resultados encontrados."),
            _paso("El personal localiza el medicamento en la lista filtrada."),
        ])],
        [("Flujo alterno – Sin resultados", [
            _paso("El personal busca un medicamento inexistente."),
            _paso("", "El sistema muestra: No se encontraron medicamentos con ese criterio."),
        ])],
    ),
    _uc(
        "UC-006", "Filtrar por Laboratorio",
        "Administrador, Almacenero, Jefatura de Farmacia",
        "Permitir refinar el listado de medicamentos según el laboratorio fabricante.",
        "RF-008",
        "El personal selecciona un laboratorio en el filtro del módulo Medicamentos y el sistema "
        "muestra únicamente los medicamentos de ese fabricante.",
        "El usuario debe estar en el módulo Medicamentos con datos cargados.",
        "El listado muestra solo medicamentos del laboratorio seleccionado.",
        [_curso("Curso normal de eventos", [
            _paso("El personal abre el selector Filtrar por Laboratorio."),
            _paso("El personal elige un laboratorio de la lista."),
            _paso("", "El sistema aplica el filtro sobre el inventario cargado."),
            _paso("", "El sistema actualiza la tabla mostrando solo los registros del laboratorio elegido."),
            _paso("El personal puede combinar el filtro con la búsqueda por texto."),
        ])],
    ),
    _uc(
        "UC-007", "Registrar Medicamento",
        "Administrador, Almacenero, Farmacia",
        "Permitir incorporar un nuevo medicamento al inventario mediante el formulario de registro.",
        "RF-005",
        "El personal accede a la pantalla Nuevo Medicamento, completa la información básica y los "
        "metadatos del lote, y guarda el registro en la base de datos.",
        "El usuario debe tener permiso de registro. El código de medicamento debe ser único.",
        "El medicamento queda registrado con estado de stock calculado.",
        [_curso("Curso normal de eventos", [
            _paso("El personal hace clic en Nuevo Medicamento."),
            _paso("", "El sistema muestra la pantalla de Registro Rápido de Medicamento."),
            _paso("El personal selecciona laboratorio y busca o ingresa el nombre del medicamento."),
            _paso("El personal completa costo, precio, stock mínimo, stock inicial, lote y vencimiento."),
            _paso("El personal presiona Registrar Medicamento."),
            _paso("", "El sistema valida los campos y calcula el estado de stock."),
            _paso("", "El sistema inserta el registro y retorna al listado de medicamentos."),
        ])],
    ),
    _uc(
        "UC-008", "Ingresar Datos de Lote",
        "Administrador, Almacenero, Farmacia",
        "Permitir registrar la información operativa del lote físico al dar de alta un medicamento.",
        "RF-004",
        "Como parte del registro, el personal ingresa número de lote, fecha de vencimiento, costo "
        "unitario según boleta, stock inicial del lote y registro sanitario.",
        "El personal debe estar en el formulario de registro de medicamento.",
        "Los metadatos del lote quedan almacenados junto al medicamento.",
        [_curso("Curso normal de eventos", [
            _paso("El personal accede a la sección Completa estos datos manualmente del formulario."),
            _paso("El personal ingresa costo unitario y precio de venta."),
            _paso("El personal ingresa stock mínimo y stock inicial del lote."),
            _paso("El personal ingresa número de lote y fecha de vencimiento."),
            _paso("El personal ingresa el registro sanitario si aplica."),
            _paso("", "El sistema valida que los campos obligatorios estén completos antes de guardar."),
        ])],
    ),
    _uc(
        "UC-009", "Modificar Medicamento",
        "Administrador, Almacenero",
        "Permitir corregir o actualizar la información de un medicamento registrado.",
        "RF-009",
        "El personal localiza el medicamento en el listado, abre la edición, modifica los campos "
        "necesarios y el sistema recalcula el estado de stock.",
        "El medicamento debe existir en el inventario.",
        "Los datos del medicamento quedan actualizados en la base de datos.",
        [_curso("Curso normal de eventos", [
            _paso("El personal localiza el medicamento en la tabla del módulo Medicamentos."),
            _paso("El personal hace clic en Editar."),
            _paso("", "El sistema muestra el formulario con los datos actuales."),
            _paso("El personal modifica los campos requeridos y guarda."),
            _paso("", "El sistema valida, recalcula el estado de stock y actualiza el registro."),
        ])],
    ),
    _uc(
        "UC-010", "Consultar Medicamento",
        "Técnico de Farmacia, Farmacia",
        "Permitir consultar disponibilidad, stock y precio de venta sin modificar el inventario.",
        "RF-006",
        "El personal de caja o farmacia busca un medicamento y visualiza en la tabla su stock actual, "
        "stock mínimo, estado semáforo y precio de venta.",
        "El usuario debe haber iniciado sesión. Deben existir medicamentos registrados.",
        "El personal obtiene la información de consulta. No se realizan cambios.",
        [_curso("Curso normal de eventos", [
            _paso("El personal accede al módulo Medicamentos."),
            _paso("El personal busca el medicamento por nombre o código."),
            _paso("", "El sistema filtra y muestra la fila con stock, estado y precio."),
            _paso("El personal lee la disponibilidad y el precio para atender la consulta o dispensación."),
        ])],
    ),
    _uc(
        "UC-011", "Visualizar Bandeja de Notificaciones",
        "Técnico de Farmacia, Jefatura de Farmacia, Administrador",
        "Permitir consultar las alertas del sistema sobre stock y vencimientos en una bandeja ordenada.",
        "—",
        "El sistema muestra las notificaciones generadas automáticamente (stock bajo, crítico, "
        "vencimientos), clasificadas por prioridad, con opción de marcar como leídas.",
        "El usuario debe haber iniciado sesión.",
        "Las notificaciones consultadas pueden marcarse como leídas.",
        [_curso("Curso normal de eventos", [
            _paso("El personal accede al módulo Notificaciones."),
            _paso("", "El sistema carga la bandeja con alertas ordenadas por prioridad."),
            _paso("", "El sistema resalta las notificaciones no leídas y de alta prioridad."),
            _paso("El personal revisa las alertas pendientes."),
            _paso("El personal puede marcar una o todas como leídas."),
            _paso("", "El sistema actualiza el estado leída en la base de datos."),
        ])],
    ),
    _uc(
        "UC-012", "Visualizar Medicamentos por Vencer",
        "Técnico de Farmacia, Jefatura de Farmacia",
        "Permitir identificar medicamentos próximos a vencer o ya vencidos.",
        "RF-011",
        "En Control de Inventario, el sistema muestra la pestaña o vista de medicamentos por vencer "
        "con días restantes hasta el vencimiento.",
        "Deben existir medicamentos con fecha de vencimiento registrada.",
        "El personal visualiza el listado de medicamentos por vencer o vencidos.",
        [_curso("Curso normal de eventos", [
            _paso("El personal accede a Control de Inventario."),
            _paso("El personal selecciona la pestaña Por vencer."),
            _paso("", "El sistema filtra medicamentos con vencimiento en los próximos 90 días o vencidos."),
            _paso("", "El sistema muestra nombre, lote, fecha y días restantes."),
        ])],
    ),
    _uc(
        "UC-013", "Filtrar Medicamentos por Vencer",
        "Técnico de Farmacia, Jefatura de Farmacia",
        "Permitir refinar la lista de vencimientos por criterios adicionales.",
        "RF-013",
        "El personal aplica filtros por laboratorio, mes o año sobre la vista de medicamentos "
        "por vencer para una consulta más precisa.",
        "El personal debe estar en la vista de medicamentos por vencer.",
        "El sistema muestra el subconjunto filtrado de medicamentos.",
        [_curso("Curso normal de eventos", [
            _paso("El personal visualiza la lista de medicamentos por vencer."),
            _paso("El personal selecciona criterios de filtro (laboratorio, periodo)."),
            _paso("", "El sistema aplica los filtros sobre el conjunto de vencimientos."),
            _paso("", "El sistema actualiza la tabla con los resultados filtrados."),
        ])],
    ),
    _uc(
        "UC-014", "Visualizar Semáforo de Stock",
        "Técnico de Farmacia, Jefatura de Farmacia",
        "Permitir visualizar el estado del stock mediante indicadores Normal, Bajo y Crítico.",
        "RF-010",
        "El sistema presenta tarjetas o indicadores con la cantidad de medicamentos en cada estado "
        "del semáforo de stock en el módulo Control de Inventario.",
        "Deben existir medicamentos con stock y stock mínimo definidos.",
        "El personal visualiza el resumen del semáforo de stock.",
        [_curso("Curso normal de eventos", [
            _paso("El personal accede a Control de Inventario."),
            _paso("", "El sistema calcula los totales por estado Normal, Bajo y Crítico."),
            _paso("", "El sistema muestra las tarjetas del semáforo con colores verde, amarillo y rojo."),
            _paso("El personal identifica la situación general del inventario."),
        ])],
    ),
    _uc(
        "UC-015", "Listar Medicamentos con Semáforo",
        "Técnico de Farmacia, Jefatura de Farmacia",
        "Permitir listar todos los medicamentos mostrando su estado de stock con código de colores.",
        "RF-012",
        "El sistema muestra la tabla completa de inventario con badge de estado por fila, "
        "permitiendo filtrar por pestañas Todos, Críticos, Bajo o Por vencer.",
        "El usuario debe tener acceso al módulo Control de Inventario.",
        "El personal visualiza el listado con el semáforo aplicado a cada medicamento.",
        [_curso("Curso normal de eventos", [
            _paso("El personal accede a Control de Inventario."),
            _paso("", "El sistema carga la tabla de medicamentos con columna Estado."),
            _paso("El personal selecciona la pestaña deseada (Todos, Críticos, Bajo)."),
            _paso("", "El sistema filtra y muestra los medicamentos con su indicador de color."),
        ])],
    ),
    _uc(
        "UC-016", "Generar Reporte General",
        "Jefatura de Farmacia",
        "Permitir emitir el reporte consolidado del inventario con filtros y exportación.",
        "RF-014",
        "El usuario accede a Reportes, selecciona Reporte General, define filtros de fecha y "
        "visualiza indicadores de valor, cantidad por estado y distribución por categoría. "
        "Puede exportar a Excel.",
        "El usuario debe tener rol Jefatura o Administrador.",
        "El sistema muestra el reporte general. Opcionalmente se descarga el archivo Excel.",
        [_curso("Curso normal de eventos", [
            _paso("El usuario accede al módulo Reportes."),
            _paso("El usuario selecciona la tarjeta Reporte General."),
            _paso("El usuario define el rango de fechas en los filtros."),
            _paso("", "El sistema calcula totales, valor de inventario y distribución por categoría."),
            _paso("", "El sistema muestra el reporte en pantalla."),
            _paso("El usuario puede hacer clic en Exportar a Excel."),
            _paso("", "El sistema genera el archivo para descarga."),
        ])],
    ),
    _uc(
        "UC-017", "Generar Reporte Ingresos y Salidas",
        "Jefatura de Farmacia",
        "Permitir consultar movimientos de entradas y salidas del inventario por periodo.",
        "RF-015",
        "El sistema muestra gráficos de entradas y salidas semanales y comparativa mensual "
        "de ventas versus compras, con filtro por rango de tiempo.",
        "Deben existir movimientos registrados en el periodo.",
        "El sistema presenta el reporte de ingresos y salidas.",
        [_curso("Curso normal de eventos", [
            _paso("El usuario accede a Reportes y selecciona Ingresos y Salidas."),
            _paso("El usuario ajusta el filtro de fechas."),
            _paso("", "El sistema consulta movimientos_semana y comparativa_mensual."),
            _paso("", "El sistema muestra gráficos de barras con entradas y salidas."),
        ])],
    ),
    _uc(
        "UC-018", "Visualizar Medicamentos de Mayor Rotación",
        "Jefatura de Farmacia",
        "Permitir identificar los medicamentos con mayor nivel de salida o venta en un periodo.",
        "RF-016",
        "El sistema lista los medicamentos ordenados por rotación y permite generar el reporte "
        "correspondiente para análisis y exportación.",
        "El usuario debe tener acceso al módulo Reportes.",
        "El personal visualiza el ranking de rotación de medicamentos.",
        [_curso("Curso normal de eventos", [
            _paso("El usuario selecciona Mayor Rotación en el módulo Reportes."),
            _paso("", "El sistema clasifica los medicamentos por nivel de rotación."),
            _paso("", "El sistema muestra la lista ordenada de mayor a menor rotación."),
            _paso("El usuario analiza los resultados para decisiones de abastecimiento."),
        ])],
    ),
    _uc(
        "UC-019", "Visualizar Dashboard",
        "Jefatura de Farmacia, Administrador",
        "Permitir visualizar indicadores operativos generales del inventario farmacéutico.",
        "RF-017",
        "El sistema muestra en el Dashboard métricas de total de medicamentos, stock crítico, "
        "por vencer, valor de inventario, gráficos de stock por categoría y alertas activas.",
        "El usuario debe tener acceso al módulo Dashboard.",
        "El sistema presenta el panel operativo actualizado.",
        [_curso("Curso normal de eventos", [
            _paso("El usuario selecciona Dashboard en el menú lateral."),
            _paso("", "El sistema consulta estadísticas y datos agregados del inventario."),
            _paso("", "El sistema muestra tarjetas de indicadores y gráficos operativos."),
            _paso("El usuario revisa el estado general del inventario."),
        ])],
    ),
    _uc(
        "UC-020", "Visualizar Dashboard Inteligente",
        "Jefatura de Farmacia",
        "Permitir visualizar análisis avanzado con predicción de demanda y tendencias por IA/ML.",
        "RF-017",
        "El módulo Analytics muestra predicción de demanda, comparativa mensual, tendencias por "
        "categoría, productos en riesgo de desabasto e insights generados.",
        "El usuario debe tener acceso al módulo Analytics.",
        "El sistema presenta el panel analítico inteligente.",
        [_curso("Curso normal de eventos", [
            _paso("El usuario selecciona Analytics en el menú lateral."),
            _paso("", "El sistema carga prediccion_demanda, tendencias y predicciones_criticas."),
            _paso("", "El sistema muestra gráficos de área, barras e insights del día."),
            _paso("El usuario utiliza la información para planificar abastecimiento."),
        ])],
    ),
]
