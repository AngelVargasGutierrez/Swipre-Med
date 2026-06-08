# UNIVERSIDAD PRIVADA DE TACNA

## FACULTAD DE INGENIERÍA
### Escuela Profesional de Ingeniería de Sistemas

<br>

**“Modelo predictivo basado en Machine Learning para la gestión de inventario de medicamentos en la Clínica La Luz, 2026”**

<br>

**Curso:** 
Construcción de Software I

**Docente:** 
Mag. Ricardo Eduardo Valcárcel Alvarado

**Integrantes:**
- Salas Jiménez, Walter Emmanuel (2022073896)
- Vargas Gutierrez, Angel Jose (2020066922)

**Tacna – Perú**
**2026 - I**

---

# Diccionario de Datos - Sistema Web (SWIPRE-MED)
**Gestión de Configuración de Software**
**Versión:** 1.0
**Fecha:** Junio 2026
**Base de Datos:** mopgimed (MySQL)

---

## 📋 Índice
1. [Introducción](#introducción)
2. [Módulo de Autenticación y Usuarios](#módulo-de-autenticación-y-usuarios)
3. [Módulo de Inventario de Medicamentos](#módulo-de-inventario-de-medicamentos)
4. [Módulo de Analítica y Predicciones (Machine Learning)](#módulo-de-analítica-y-predicciones-machine-learning)
5. [Módulo de Notificaciones y Alertas](#módulo-de-notificaciones-y-alertas)
6. [Módulo de Auditoría](#módulo-de-auditoría)
7. [Relaciones entre Tablas](#relaciones-entre-tablas)
8. [Índices y Optimizaciones](#índices-y-optimizaciones)

---

## Introducción
Este diccionario de datos documenta la estructura completa de la base de datos `mopgimed` del sistema SWIPRE-MED (Sistema Web de Inventario Predictivo de Medicamentos). La base de datos está implementada en MySQL.

**Convenciones**
- **PK**: Clave Primaria
- **FK**: Clave Foránea
- **NN**: No Nulo (NOT NULL)
- **ID**: Auto-incremental (AUTO_INCREMENT)
- **DF**: Valor por Defecto
- **UQ**: Unique Constraint

**Valores de Estado Comunes**
- **Estado Usuario**: Activo, Inactivo
- **Estado Medicamento**: Normal, Bajo, Crítico

---

## Módulo de Autenticación y Usuarios

### Tabla: users
**Propósito:** Almacena la información de los usuarios del sistema, incluyendo sus credenciales, roles y estado de acceso.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | int | PK, ID, NN | Identificador único del usuario |
| `username` | varchar(50) | NN, UQ | Nombre de usuario para login |
| `password` | varchar(100) | NN | Contraseña cifrada del usuario |
| `role` | varchar(20) | NN | Identificador interno del rol (admin, farmacia, jefatura, almacen, logistica) |
| `name` | varchar(100) | NN | Nombre completo del usuario |
| `role_label` | varchar(50) | NN | Etiqueta visible del rol (Administrador, Farmacia, etc.) |
| `email` | varchar(100) | NULL | Correo electrónico del usuario |
| `estado` | varchar(20) | DF='Activo' | Estado de la cuenta: Activo, Inactivo |
| `created_at` | date | NULL | Fecha de creación de la cuenta |

**Índices:**
- PK: `id` (Clustered)
- UQ: `username` (Unique)

---

## Módulo de Inventario de Medicamentos

### Tabla: medicamentos
**Propósito:** Gestiona el catálogo de medicamentos, control de lotes, precios y niveles de stock.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | int | PK, ID, NN | Identificador único del medicamento |
| `codigo` | varchar(20) | NN, UQ | Código único del medicamento (ej: FARM-ANL001) |
| `nombre` | varchar(200) | NN | Nombre comercial o genérico del medicamento |
| `laboratorio` | varchar(100) | NULL | Laboratorio fabricante |
| `lote` | varchar(50) | NULL | Número de lote en inventario |
| `stock` | int | DF=0 | Cantidad de unidades disponibles |
| `stock_min` | int | DF=0 | Nivel de stock mínimo de seguridad |
| `costo_unit` | decimal(10,2) | DF=0.00 | Precio de compra unitario |
| `precio_venta` | decimal(10,2) | DF=0.00 | Precio de venta al público |
| `vencimiento` | date | NULL | Fecha de vencimiento del lote |
| `r_sanitario` | varchar(50) | NULL | Registro sanitario |
| `estado` | varchar(20) | DF='Normal' | Estado del stock (Normal, Bajo, Crítico) |
| `categoria` | varchar(100) | NULL | Categoría terapéutica del medicamento |

**Índices:**
- PK: `id` (Clustered)
- UQ: `codigo` (Unique)

---

## Módulo de Analítica y Predicciones (Machine Learning)

### Tabla: prediccion_demanda
**Propósito:** Almacena los resultados del modelo de Machine Learning sobre la demanda futura de los medicamentos.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | int | PK, ID, NN | Identificador único |
| `mes` | varchar(10) | NULL | Mes evaluado (ej: Ene, Feb) |
| `real_val` | int | NULL | Valor real de demanda histórica |
| `prediccion` | int | NULL | Valor predicho por el modelo de ML |

### Tabla: predicciones_criticas
**Propósito:** Registra los medicamentos que el modelo predictivo ha identificado con riesgo de agotamiento inminente.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | int | PK, ID, NN | Identificador único |
| `nombre` | varchar(200) | NULL | Nombre del medicamento en riesgo |
| `stock_actual` | int | NULL | Stock disponible actualmente |
| `fecha_predicha` | varchar(20) | NULL | Fecha en la que se predice el quiebre de stock |
| `ordenar` | int | NULL | Cantidad sugerida a ordenar |
| `prioridad` | varchar(10) | NULL | Nivel de prioridad (Alta, Media, Baja) |

### Tabla: tendencias
**Propósito:** Analiza el comportamiento y fluctuación de la demanda agrupado por categorías terapéuticas.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | int | PK, ID, NN | Identificador único |
| `categoria` | varchar(100) | NULL | Categoría del medicamento evaluada |
| `cambio` | int | NULL | Porcentaje o cantidad de cambio en la demanda |
| `positivo` | tinyint(1) | DF=1 | Indicador booleano de si el cambio es positivo (1) o negativo (0) |

### Tabla: movimientos_semana
**Propósito:** Registra estadísticas de entradas y salidas de inventario agrupadas por los días de la semana.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | int | PK, ID, NN | Identificador único |
| `dia` | varchar(10) | NULL | Día de la semana (Lun, Mar, etc.) |
| `entradas` | int | DF=0 | Cantidad de unidades ingresadas |
| `salidas` | int | DF=0 | Cantidad de unidades despachadas |

### Tabla: comparativa_mensual
**Propósito:** Mantiene un registro histórico del flujo financiero y de inventario mensual.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | int | PK, ID, NN | Identificador único |
| `mes` | varchar(10) | NULL | Mes evaluado |
| `ventas` | int | DF=0 | Total de ventas registradas |
| `compras` | int | DF=0 | Total de compras realizadas |

---

## Módulo de Notificaciones y Alertas

### Tabla: alertas
**Propósito:** Gestiona las alertas críticas generadas automáticamente por el sistema respecto al inventario.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | int | PK, ID, NN | Identificador único de alerta |
| `titulo` | varchar(200) | NULL | Título de la alerta |
| `descripcion` | text | NULL | Detalle de la situación (stock bajo, vencimiento próximo) |
| `fecha` | varchar(50) | NULL | Fecha y hora de generación de la alerta |
| `color` | varchar(20) | NULL | Color representativo de la severidad (ej: red, yellow) |

### Tabla: notificaciones
**Propósito:** Almacena la bandeja de notificaciones operativas dirigidas a los usuarios del sistema.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | int | PK, ID, NN | Identificador único de notificación |
| `tipo` | varchar(50) | NULL | Categoría (stock-critico, vencimiento, nuevo-lote) |
| `titulo` | varchar(200) | NULL | Título corto |
| `descripcion` | text | NULL | Contenido del mensaje |
| `fecha` | varchar(50) | NULL | Fecha de emisión |
| `color` | varchar(20) | NULL | Color de la insignia de notificación |
| `leida` | tinyint(1) | DF=0 | Estado de visualización (1=Leída, 0=No leída) |
| `prioridad` | varchar(10) | DF='Low' | Nivel de urgencia (High, Medium, Low) |

---

## Módulo de Auditoría

### Tabla: historial_acciones
**Propósito:** Bitácora de sistema (Log) para la trazabilidad de las acciones importantes ejecutadas por los usuarios.

| Campo | Tipo | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | int | PK, ID, NN | Identificador único del registro |
| `fecha` | varchar(50) | NULL | Fecha y hora exacta de la acción |
| `usuario` | varchar(100) | NULL | Nombre del usuario responsable |
| `accion` | varchar(200) | NULL | Acción realizada (ej: 'Actualizó stock') |
| `modulo` | varchar(50) | NULL | Módulo donde ocurrió (Inventario, Usuarios, etc.) |
| `detalle` | text | NULL | Datos adicionales del cambio |

---

## Relaciones entre Tablas
Debido a la naturaleza ágil y desconectada del prototipo predictivo actual, las relaciones en base de datos están manejadas a nivel lógico en la aplicación (Capa Backend/ORM), basándose en la trazabilidad por nombre y códigos, garantizando la flexibilidad del modelo.

**Relaciones Lógicas (Capa de Aplicación):**
- **Historial de Acciones → Usuarios:** Mediante el campo `historial_acciones.usuario` mapeado a `users.name`.
- **Predicciones Críticas → Medicamentos:** Mediante `predicciones_criticas.nombre` mapeado a `medicamentos.nombre`.

---

## Índices y Optimizaciones
**Índices Clustered (Claves Primarias)**
- Todas las tablas poseen un índice `Clustered` en su clave primaria (campo `id`).

**Índices No Clustered Recomendados para el Entorno de Producción**
Para optimizar consultas del modelo de Machine Learning y reportería:
- `users`: Índice sobre `username` para acelerar la autenticación.
- `medicamentos`: Índice en `codigo` (Unique) e índice secundario en `estado` y `categoria`.
- `historial_acciones`: Índice sobre `fecha` y `usuario` para auditoría ágil.

**Constraints y Validaciones de Lógica de Negocios (Aplicación)**
- **Cantidades:** `stock`, `stock_min`, `entradas`, `salidas`, `ordenar` >= 0.
- **Fechas:** `vencimiento` debe ser mayor a la fecha actual al momento del ingreso.
- **Precios:** `costo_unit` y `precio_venta` >= 0.00.

---
**Fin del Diccionario de Datos**
**Última Actualización:** Junio 2026
**Versión del Documento:** 1.0
