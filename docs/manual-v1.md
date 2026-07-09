# Manual de Usuario — CRM JEFSEI

**Versión:** 1.0.0  
**Fecha:** Julio 2026  
**Sistema:** Frontend JEFSEI (Módulo Comercial, Evaluación, Cobranza y Gerencia)

---

## Índice

1. [Introducción](#1-introducción)
2. [Acceso al Sistema](#2-acceso-al-sistema)
3. [Navegación General](#3-navegación-general)
4. [Roles y Permisos](#4-roles-y-permisos)
5. [Módulo: Inicio](#5-módulo-inicio)
6. [Módulo: Dashboard](#6-módulo-dashboard)
7. [Módulo: Oportunidades](#7-módulo-oportunidades)
8. [Módulo: Prospectos](#8-módulo-prospectos)
9. [Módulo: Solicitudes de Cotización](#9-módulo-solicitudes-de-cotización)
10. [Módulo: Cotizaciones / Estudios Emitidos](#10-módulo-cotizaciones--estudios-emitidos)
11. [Módulo: Personal](#11-módulo-personal)
12. [Módulo: Administradores de Condominios](#12-módulo-administradores-de-condominios)
13. [Módulo: Detalle de Póliza](#13-módulo-detalle-de-póliza)
14. [Características Transversales](#14-características-transversales)
15. [Solución de Problemas Comunes](#15-solución-de-problemas-comunes)

---

## 1. Introducción

**CRM JEFSEI** es un sistema de gestión de relaciones con clientes diseñado para una corredora de seguros. Permite administrar el ciclo de vida completo de prospectos, clientes, cotizaciones, estudios comerciales, pólizas y planes de pago.

### Propósito del sistema

- Centralizar la información de prospectos y clientes.
- Gestionar solicitudes de cotización con compañías de seguros.
- Generar estudios comerciales y cotizaciones.
- Administrar pólizas, planes de pago y cobranza.
- Proveer métricas y dashboards para la toma de decisiones gerenciales.

### Público objetivo

Este manual está dirigido a todos los usuarios del sistema, incluyendo ejecutivos comerciales, ejecutivos de evaluación de proyectos, ejecutivos de cobranza, ejecutivos de renovación, ejecutivos de siniestros, asistentes de renovaciones y gerentes.

---

## 2. Acceso al Sistema

### Requisitos técnicos

- Navegador web moderno: Google Chrome (recomendado), Mozilla Firefox, Microsoft Edge o Safari.
- Conexión a internet estable.
- Resolución de pantalla mínima recomendada: 1024 × 768 píxeles.

### URL de acceso

La URL del sistema es https://crm-jefsei.cl.

### Inicio de sesión

1. Abra el navegador y diríjase a la URL del sistema.
2. Será redirigido automáticamente a la página de **Inicio de Sesión**.
3. Ingrese su **RUT** en el campo correspondiente.
4. Ingrese su **contraseña** en el campo correspondiente.
5. Presione el botón **"Iniciar sesión"**.
6. Si las credenciales son correctas, será redirigido a la página de **Inicio**.
7. Si las credenciales son incorrectas, verá el mensaje: `Credenciales inválidas`.

![Pantalla de inicio de sesión]()

### Cierre de sesión

1. En la esquina superior derecha, haga clic en su nombre o iniciales (menú de usuario).
2. Seleccione **"Cerrar sesión"**.
3. Será redirigido a la página de inicio de sesión.

### Sesión expirada

Si su sesión expira mientras usa el sistema, aparecerá una notificación y será redirigido automáticamente a la página de inicio de sesión. Deberá volver a ingresar sus credenciales.

---

## 3. Navegación General

### Layout del sistema

El sistema se compone de tres áreas principales:

```
┌─────────────────────────────────────────────────────────┐
│  Header (barra superior)                                │
│  Título de página    Fecha actual    [Usuario ▼]        │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Sidebar  │  Contenido principal                         │
│ (menú)   │                                              │
│          │                                              │
│          │                                              │
│          │                                              │
├──────────┴──────────────────────────────────────────────┤
│  Footer                                                 │
└─────────────────────────────────────────────────────────┘
```

### Sidebar (Barra lateral)

La barra lateral muestra las opciones de navegación disponibles según su rol. Los ítems visibles cambian dinámicamente:

| Ítem de navegación               | Ícono           | Ruta                              | Visible para              |
| -------------------------------- | --------------- | --------------------------------- | ------------------------- |
| Inicio                           | Home            | `/`                               | Todos los roles           |
| Dashboard                        | LayoutDashboard | `/dashboard`                      | Solo gerentes             |
| Oportunidades                    | ChartBar        | `/oportunidades`                  | Solo gerentes             |
| Prospectos                       | Users           | `/prospectos`                     | Todos los roles           |
| Solicitudes de cotización        | FileSearch      | `/solicitudes-estudio`            | Ej. Evaluación + Gerentes |
| Cotizaciones / estudios emitidos | FileCheck       | `/cotizaciones-estudios-emitidos` | Ej. Evaluación + Gerentes |
| Personal                         | Group           | `/personal`                       | Solo gerentes             |
| Administradores de condominios   | Building2       | `/administradores`                | Todos los roles           |

En dispositivos móviles, la sidebar se oculta y se muestra mediante un botón de menú (hamburguesa) con un overlay semitransparente.

### Header (Barra superior)

- **Lado izquierdo**: Título de la página actual (se actualiza según la ruta).
- **Centro**: Fecha actual en formato español (ej: "jueves, 9 de julio de 2026").
- **Lado derecho**: Menú de usuario con:
  - Iniciales del usuario (avatar circular).
  - Nombre completo del usuario.
  - Roles del usuario (separados por comas).
  - Opciones: **Perfil**, **Configuración**, **Cerrar sesión**.

---

## 4. Roles y Permisos

El sistema cuenta con 9 roles, cada uno con permisos específicos:

| Código                           | Nombre                         | Descripción                                                            |
| -------------------------------- | ------------------------------ | ---------------------------------------------------------------------- |
| `EJECUTIVO_COMERCIAL`            | Ejecutivo Comercial            | Gestión comercial de prospectos y clientes, cotizaciones, renovaciones |
| `EJECUTIVO_EVALUACION_PROYECTOS` | Ejecutivo Evaluación Proyectos | Evaluación técnica de solicitudes, cotizaciones y estudios             |
| `EJECUTIVO_RENOVACION`           | Ejecutivo Renovación           | Gestión de renovaciones de pólizas                                     |
| `EJECUTIVO_COBRANZA`             | Ejecutivo Cobranza             | Gestión de cobranza y planes de pago                                   |
| `EJECUTIVO_SINIESTROS`           | Ejecutivo Siniestros           | Gestión de siniestros                                                  |
| `GERENTE_COMERCIAL`              | Gerente Comercial              | Supervisión del área comercial                                         |
| `GERENTE_GENERAL`                | Gerente General                | Acceso completo a todas las funcionalidades                            |
| `GERENTE_OPERACIONES`            | Gerente Operaciones            | Supervisión de operaciones                                             |
| `ASISTENTE_RENOVACIONES`         | Asistente Renovaciones         | Soporte en procesos de renovación                                      |

### Matriz de acceso por módulo

| Módulo                    | Ej. Comercial | Ej. Evaluación | Gerentes | Ej. Cobranza | Otros   |
| ------------------------- | ------------- | -------------- | -------- | ------------ | ------- |
| Inicio                    | ✅            | ✅             | ✅       | ✅           | ✅      |
| Dashboard                 | —             | —              | ✅       | —            | —       |
| Oportunidades             | —             | —              | ✅       | —            | —       |
| Prospectos                | ✅            | ✅             | ✅       | ✅           | ✅      |
| Solicitudes de cotización | —             | ✅             | ✅       | —            | —       |
| Cotizaciones / Estudios   | —             | ✅             | ✅       | —            | —       |
| Personal                  | —             | —              | ✅       | —            | —       |
| Administradores           | ✅            | ✅             | ✅       | ✅           | ✅      |
| Detalle Póliza            | Parcial       | Parcial        | Completo | Plan pago    | Parcial |

---

## 5. Módulo: Inicio

**Ruta:** `/`  
**Acceso:** Todos los usuarios autenticados

### Descripción

La página de inicio es el punto de entrada principal después de iniciar sesión. Muestra información relevante según el rol del usuario.

### Componentes

#### Para Ejecutivo Comercial

1. **Métricas del Ejecutivo Comercial**
   - Prima vendida del mes actual.
   - Meta mensual en UF.
   - Comisión generada.

2. **Tarjetas KPI**
   - **Clientes asignados**: Total de prospectos asignados.
   - **Cotizaciones solicitadas**: Cotizaciones solicitadas a la fecha.
   - **Estudios disponibles**: Estudios comerciales listos para descargar.
   - **Clientes activos**: Clientes con pólizas vigentes.
   - Al hacer clic en una KPI, se abre un panel lateral (Sheet) con la lista filtrada de prospectos correspondientes.

3. **Lista de Prospectos**
   - Tabla con los prospectos asignados al ejecutivo.
   - Incluye filtros de búsqueda y estado.

4. **Calendario de Recordatorios**
   - Tarjeta con calendario mensual.
   - Muestra recordatorios y actividades agendadas para cada día.

5. **Comunicados de Gerencia**
   - Tarjeta con los últimos comunicados emitidos por la gerencia.

#### Para Ejecutivo de Evaluación de Proyectos

1. **Tarjetas KPI**
   - **Pendientes de revisión**: Solicitudes de cotización pendientes de revisión.
   - **Información completa**: Solicitudes con toda la información requerida.
   - **Recotizaciones pendientes**: Solicitudes de recotización por atender.
   - **Estudios por generar**: Estudios comerciales pendientes de generar.
   - Los KPIs tienen enlaces directos a "Solicitudes de estudio" y "Cotizaciones / estudios emitidos".

2. **Lista de Prospectos**
3. **Calendario de Recordatorios**
4. **Comunicados de Gerencia**

#### Para Gerentes

- KPIs gerenciales.
- Lista completa de prospectos.
- Calendario y comunicados.

### Acciones disponibles

- **Filtrar prospectos**: Use el campo de búsqueda o los filtros desplegables.
- **Ver detalle**: Haga clic en un prospecto para ir a su detalle.
- **Gestionar recordatorios**: Haga clic en una fecha del calendario para ver o crear recordatorios.
- **Leer comunicados**: Los comunicados de gerencia aparecen en la tarjeta correspondiente.

---

## 6. Módulo: Dashboard

**Ruta:** `/dashboard`  
**Acceso:** Solo gerentes (`GERENTE_COMERCIAL`, `GERENTE_GENERAL`, `GERENTE_OPERACIONES`)

### Descripción

Panel de control gerencial con métricas agregadas de toda la organización. Proporciona una visión general del rendimiento comercial, operaciones y evaluación de proyectos.

### Componentes

#### Producción

- **Mes actual**: Prima neta total del mes, variación porcentual respecto al mes anterior.
- **Tendencia 12 meses**: Gráfico de barras o líneas mostrando la prima neta mes a mes.
- **Por compañía**: Desglose de primas por compañía de seguros.
- **Por ejecutivo**: Desglose de primas por ejecutivo comercial.
- **Por ramo**: Desglose de primas por producto/ramo.
- **Compañía top**: Compañía con mayor prima neta en el período.

#### Actividades Comerciales

- **Por tipo**: Cantidad de actividades agendadas, concretadas y pendientes por tipo de gestión.
- **Resumen**: Totales globales y porcentaje de cumplimiento.

#### Reportes de Pólizas

- **Por comuna**: Cantidad de pólizas agrupadas por comuna.
- **Por ramo/producto**: Cantidad de pólizas agrupadas por producto.

#### Evaluación de Proyectos

- **KPIs**: Total de proyectos, monto total asegurado en UF, tasa de conversión.
- **Por compañía**: Proyectos agrupados por compañía.
- **Por ramo**: Proyectos agrupados por producto.

### Acciones disponibles

- Visualización de métricas en tiempo real (los datos se actualizan periódicamente).
- Los gráficos son interactivos (hover para ver valores específicos).
- Navegación desde KPIs a secciones detalladas.

---

## 7. Módulo: Oportunidades

**Ruta:** `/oportunidades`  
**Acceso:** Solo gerentes (`GERENTE_COMERCIAL`, `GERENTE_GENERAL`, `GERENTE_OPERACIONES`)

### Descripción

Pipeline de procesos comerciales. Muestra el estado y avance de las oportunidades de negocio en curso.

### Componentes

1. **Panel de Procesos Comerciales**
   - Lista de procesos comerciales activos y cerrados.
   - Cada proceso muestra: cliente, línea de negocio, estado actual, ejecutivo asignado, fechas.

2. **Filtros**
   - Búsqueda por texto.
   - Filtro por estado (abiertos/cerrados).
   - Filtro por ejecutivo.

3. **Acciones por proceso**
   - Ver detalle del proceso comercial.
   - Registrar aceptación del cliente.
   - Cerrar proceso.
   - Generar reportes.

### Acciones disponibles

- **Filtrar procesos**: Use los filtros disponibles para acotar la lista.
- **Abrir detalle**: Haga clic en un proceso para ver su información completa, historial de estados y solicitudes de cotización asociadas.
- **Cerrar proceso**: Si el proceso ha concluido, puede cerrarlo desde el detalle.

---

## 8. Módulo: Prospectos

**Ruta:** `/prospectos`  
**Acceso:** Todos los usuarios autenticados

### Descripción

Gestión de prospectos (potenciales clientes) y clientes. Permite registrar, editar, asignar ejecutivos y dar seguimiento comercial.

### Lista de Prospectos

1. **Vista de lista**
   - Tabla con columnas: RUT, nombre, línea de negocio, ejecutivo asignado, estado, fecha de creación.
   - En dispositivos móviles, la tabla se convierte en tarjetas (cards).

2. **Filtros**
   - Búsqueda por RUT o nombre.
   - Filtro por estado.
   - Filtro por línea de negocio.
   - Filtro por ejecutivo asignado.

3. **Acciones desde la lista**
   - **Ver detalle**: Haga clic en un prospecto para ir a su página de detalle.
   - **Registrar nuevo prospecto**: Botón "Agregar prospecto" que abre un modal.

### Registrar Nuevo Prospecto

1. Haga clic en el botón **"Agregar prospecto"**.
2. Se abrirá un modal con un formulario dividido en secciones:

   **Tipo de cliente** (toggle):
   - **Condominio**: Para comunidades y edificios.
   - **Línea personal / Persona natural**: Para personas individuales.

   **Sección: Datos generales** (siempre visible)
   - RUT (con validación en tiempo real).
   - Nombre.
   - Dirección.
   - Región y Comuna (selects en cascada: al seleccionar región, se cargan las comunas).
   - Correo electrónico.
   - Teléfono.
   - Línea de negocio.
   - _(Solo condominio)_ Uso del condominio, Administrador asociado.

   **Sección: Características de construcción** (solo condominio)
   - Año de construcción.
   - Materialidad (select con 4 opciones → auto-asigna clasificación de incendio).
   - Clasificación preliminar incendio (solo lectura, se computa automáticamente).
   - Tiene locales comerciales (Sí/No).
   - Procesos productivos (Sí/No).

   **Sección: Información para evaluación del seguro** (solo condominio)
   - Metros cuadrados construidos.
   - UF por metro cuadrado.
   - Porcentaje de depreciación.
   - Porcentaje de espacios comunes.
   - Número de pisos.
   - Número de torres.
   - Número de departamentos.
   - Número de subterráneos.
   - ¿Tiene piscina? (Sí/No → si es Sí, se habilita "Ubicación de la piscina").
   - Ubicación de la piscina (solo si tiene piscina).

   **Sección: Medidas de seguridad** (solo condominio)
   - Alarma de incendio (Sí/No).
   - Sprinklers (Sí/No).

   **Sección: Observaciones** (siempre visible)
   - Textarea para notas adicionales.

3. Complete los campos obligatorios (marcados con indicaciones visuales).
4. Haga clic en **"Guardar"** para registrar el prospecto.
5. Si hay errores de validación, se mostrarán en los campos correspondientes.

### Detalle de Prospecto

**Ruta:** `/prospectos/[id]`  
**Acceso:** Todos los usuarios (contenido varía según rol)

Al hacer clic en un prospecto desde la lista, accede a su página de detalle, que muestra:

1. **Encabezado**: Nombre del prospecto, RUT, estado.
2. **Secciones visibles según el rol**:
   - **Información general**: Datos del prospecto, dirección, contacto.
   - **Información del condominio** (si aplica): Características de construcción, medidas de seguridad.
   - **Administrador asociado**: Si el prospecto es un condominio, muestra el administrador asignado con enlace a su perfil.
   - **Ejecutivo comercial asignado**: Muestra el ejecutivo a cargo.
   - **Ejecutivo de evaluación asignado**: Muestra el evaluador a cargo.
   - **Oportunidades comerciales**: Procesos comerciales asociados al prospecto.
   - **Solicitudes de cotización**: Cotizaciones solicitadas para este prospecto.
   - **Pólizas**: Pólizas emitidas para este prospecto.
   - **Recordatorios**: Recordatorios asociados al prospecto, con opción de crear nuevos.
   - **Historial de gestiones**: Registro de gestiones comerciales realizadas.

### Acciones disponibles en detalle

- **Editar prospecto**: Modificar datos del prospecto.
- **Asignar ejecutivo comercial**: Asignar o cambiar el ejecutivo comercial a cargo.
- **Asignar ejecutivo de evaluación**: Asignar o cambiar el ejecutivo de evaluación.
- **Solicitar cotización**: Iniciar una solicitud de cotización para el prospecto.
- **Crear recordatorio**: Agregar un recordatorio asociado al prospecto.
- **Ver pólizas**: Navegar a las pólizas emitidas.

---

## 9. Módulo: Solicitudes de Cotización

**Ruta:** `/solicitudes-estudio`  
**Acceso:** Ejecutivo Evaluación Proyectos, Gerentes

### Descripción

Panel de gestión de solicitudes de cotización recibidas desde las compañías de seguros. Permite revisar, filtrar y dar seguimiento a cada solicitud.

### Componentes

1. **Tarjetas KPI (toggle)**
   - **Pendientes**: Solicitudes pendientes de revisión.
   - **En proceso**: Solicitudes en curso.
   - **Completadas**: Solicitudes finalizadas.
   - Al hacer clic en una KPI, se activa como filtro para mostrar solo esas solicitudes.

2. **Filtros**
   - Búsqueda por texto (cliente, RUT, etc.).
   - Select de **Estado**.
   - Select de **Prioridad** (alta/normal).
   - Select de **Ejecutivo** asignado.
   - Select de **Línea** de negocio.
   - Botón **"Limpiar"** para resetear todos los filtros.
   - Contador de resultados visibles.

3. **Tabla de solicitudes**
   - Columnas: Cliente, Línea, Prioridad, Ejecutivo, Fecha, Estado.
   - En mobile: vista de tarjetas.
   - **Badge de prioridad**: Rojo para alta, slate/gris para normal.

4. **Panel lateral (Sheet) de detalle**
   - Al hacer clic en una fila, se abre un panel con el detalle completo de la solicitud.
   - Muestra toda la información de la solicitud.
   - **Sección "Información faltante"**: Lista con ícono de alerta de los campos del prospecto que están incompletos (ej: "Rut", "Teléfono contacto", "Dirección", etc.).

### Acciones disponibles

- **Filtrar solicitudes**: Use los KPIs toggle y los filtros combinados.
- **Ver detalle**: Haga clic en una solicitud para abrir el panel lateral.
- **Identificar información faltante**: Desde el detalle, revise qué campos del prospecto deben ser completados antes de continuar.

---

## 10. Módulo: Cotizaciones / Estudios Emitidos

**Ruta:** `/cotizaciones-estudios-emitidos`  
**Acceso:** Ejecutivo Evaluación Proyectos, Gerentes

### Descripción

Historial de cotizaciones recibidas y estudios comerciales emitidos. Permite visualizar cotizaciones por compañía, generar estudios y descargar archivos.

### Componentes

1. **Tarjetas KPI**
   - **Pendientes**: Estudios pendientes de generar.
   - **Opciones recibidas**: Cotizaciones recibidas de compañías.
   - **Aseguradoras contactadas**: Compañías que han respondido.
   - **Estudios emitidos**: Estudios comerciales ya generados.
   - Cada KPI filtra la tabla al hacer clic.

2. **Filtros**
   - Búsqueda por texto.
   - Select de **Estado estudio** (pendiente/disponible).
   - Select de **Prioridad**.
   - Select de **Ejecutivo**.
   - Select de **Línea de seguro**.

3. **Tabla de cotizaciones/estudios**
   - Columnas: Cliente, Línea seguro, Ejecutivo comercial, Vencimiento, Estado vencimiento, Estado estudio, Acción.
   - Ordenable por cualquier columna (clic en el encabezado).
   - Filas expandibles.

4. **Badge de vencimiento**
   - **Vigente** (verde): La cotización está al día.
   - **Por vencer** (ámbar): Vence dentro de los próximos días.
   - **Vencida hace X días** (rojo): La cotización ya expiró.

### Acciones contextuales por fila

| ¿Tiene cotizaciones? | ¿Tiene estudio? | Botón 1                | Botón 2               |
| -------------------- | --------------- | ---------------------- | --------------------- |
| No                   | —               | _(sin acciones)_       | —                     |
| Sí                   | No              | **"Ver cotizaciones"** | **"Generar estudio"** |
| Sí                   | Sí              | **"Ver cotizaciones"** | **"Ver estudio"**     |

### Diálogo: Ver Cotizaciones

Muestra un panel con:

- **Resumen**: Cliente, Línea, Ejecutivo, Cantidad de opciones.
- **Tabla de cotizaciones**: Compañía, Monto asegurado, Vencimiento, Estado.
- **Footer**: Botón "Cerrar".

### Diálogo: Generar Estudio

Permite:

1. **Seleccionar cotización recomendada**: Radio buttons con las cotizaciones disponibles.
2. **Observaciones**: Campo de texto opcional.
3. **Subir archivo**: Cargar el archivo PDF del estudio comercial.
4. Botón **"Generar estudio"** (con estado de carga).

### Diálogo: Ver Estudio

Muestra:

- Información del estudio comercial.
- Enlace de descarga del archivo PDF (si está disponible).

---

## 11. Módulo: Personal

**Ruta:** `/personal`  
**Acceso:** Solo gerentes (`GERENTE_COMERCIAL`, `GERENTE_GENERAL`, `GERENTE_OPERACIONES`)

### Descripción

Gestión de usuarios del sistema. Permite registrar, editar y administrar las cuentas de todos los colaboradores.

### Componentes

1. **Lista de usuarios**
   - Tabla con todos los usuarios registrados.
   - Columnas: RUT, nombre, correo, rol(es), sucursal, teléfono.

2. **Registrar nuevo usuario**
   - Botón **"Agregar usuario"**.
   - Formulario con los siguientes campos:
     - **RUT**: Obligatorio, con validación.
     - **Nombre**: Nombre completo.
     - **Correo**: Correo electrónico institucional.
     - **Teléfono**: Número de contacto.
     - **Sucursal**: Selección desde lista de sucursales.
     - **Contraseña**: Asignación de contraseña inicial.
     - **Meta mensual UF**: Meta de producción mensual en UF.
     - **Rol(es)**: Selección de uno o más roles del sistema.

3. **Editar usuario**
   - Desde la lista, haga clic en un usuario para editar sus datos.
   - Puede modificar todos los campos excepto el RUT.

4. **Acciones adicionales**
   - Deshabilitar/habilitar usuarios.

### Acciones disponibles

- **Registrar**: Crear una nueva cuenta de usuario.
- **Editar**: Modificar datos de un usuario existente.
- **Cambiar rol**: Asignar o quitar roles a un usuario.
- **Deshabilitar**: Desactivar temporalmente un usuario (no puede iniciar sesión).

---

## 12. Módulo: Administradores de Condominios

**Ruta:** `/administradores` y `/administradores/[id]`  
**Acceso:** Todos los usuarios autenticados

### Descripción

Gestión de administradores de condominios. Estos son los contactos principales de los condominios asegurados o prospectos.

### Lista de Administradores

1. **Vista de lista**
   - Tabla con administradores registrados.
   - Columnas: Nombre, RUT, teléfono, correo, cantidad de condominios asociados.

2. **Registrar nuevo administrador**
   - Botón **"Agregar administrador"**.
   - Formulario con: nombre, RUT, teléfono, correo.

### Perfil de Administrador

**Ruta:** `/administradores/[id]`

Al hacer clic en un administrador, accede a su perfil con:

1. **Información del administrador**
   - Nombre.
   - RUT.
   - Teléfono.
   - Correo electrónico.

2. **Condominios asociados**
   - Lista de prospectos/condominios que administra.
   - Cada ítem tiene un botón **"Ver perfil"** que lleva al detalle del prospecto.

### Acciones disponibles

- **Registrar**: Crear un nuevo administrador de condominio.
- **Editar**: Modificar datos del administrador.
- **Ver condominios**: Explorar los condominios asociados.
- **Navegar a prospecto**: Ir al detalle del condominio desde el perfil del administrador.

---

## 13. Módulo: Detalle de Póliza

**Ruta:** `/polizas/[numeroPoliza]`  
**Acceso:** Todos los usuarios (secciones restringidas por rol)

### Descripción

Página de detalle de una póliza de seguro. Muestra información completa, plan de pago, historial y acciones disponibles.

### Componentes

1. **Encabezado de la póliza**
   - Número de póliza.
   - Cliente asegurado.
   - Compañía de seguros.
   - Producto/ramo.
   - Estado (con badge de color).
   - Tipo (Nueva / Renovación).
   - Fechas de emisión y vigencia.

2. **Información financiera**
   - Prima neta.
   - Prima total.
   - Comisión.
   - Deducibles.
   - Monto asegurado.

3. **Estado de la póliza**
   - Badge de estado con código de colores:
     - Vigente (verde)
     - Cancelada (rojo)
     - Por emitir (ámbar)
     - etc.

4. **Plan de Pago** (según rol)
   - **Acceso**: Gerentes, Ejecutivo Cobranza, Ejecutivo Comercial.
   - Tabla de cuotas: número, monto, fecha de vencimiento, estado (pagada/pendiente).
   - **Marcar cuota como pagada**: Botón disponible para cuotas pendientes.
   - **Crear plan de pago**: Si la póliza no tiene plan, se puede crear uno nuevo.

5. **Historial del proceso comercial** (solo gerentes)
   - Línea de tiempo con los cambios de estado del proceso comercial asociado.
   - Fechas, estados anteriores y nuevos, usuario que realizó el cambio.

6. **Acciones** (solo gerentes)
   - **Cancelar póliza**: Botón con confirmación. Se solicita motivo de cancelación.
   - **Reactivar póliza**: Botón para reactivar una póliza cancelada.
   - **Registrar renovación cotizada**: Registrar renovación con cotización.

### Acciones disponibles

- **Ver plan de pago**: Revise el detalle de cuotas.
- **Marcar pago**: Si tiene permisos, marque cuotas como pagadas.
- **Cancelar/Reactivar**: Solo gerentes pueden cambiar el estado de la póliza.
- **Ver historial**: Revise la línea de tiempo del proceso comercial.

---

## 14. Características Transversales

### Calendario y Recordatorios

Presente en las páginas de Inicio y Detalle de Prospecto.

1. **Calendario mensual**
   - Navegación entre meses (flechas anterior/siguiente).
   - Los días con recordatorios se muestran con un indicador.
   - Al hacer clic en un día, se muestran los recordatorios de esa fecha.

2. **Crear recordatorio**
   - Botón **"+ Agregar recordatorio"**.
   - Formulario con: fecha, hora, tipo de gestión, descripción, prospecto asociado (opcional).
   - Al guardar, el recordatorio aparece en el calendario.

3. **Gestionar recordatorios**
   - Marcar como completado (toggle).
   - Ver pendientes vs. completados.
   - Editar o eliminar recordatorios.

### Comunicados de Gerencia

Presente en la página de Inicio.

1. **Lista de comunicados**
   - Tarjeta que muestra los últimos comunicados emitidos por la gerencia.
   - Cada comunicado muestra: título, fecha de emisión, contenido/resumen.

2. **Crear comunicado** (solo gerentes)
   - Botón para redactar y publicar un nuevo comunicado.
   - Todos los usuarios ven los comunicados activos en su inicio.

### Gestión de Gestiones Comerciales

Disponible en el detalle de prospecto.

1. **Registrar gestión**
   - Formulario para registrar una gestión comercial realizada (llamada, reunión, correo, etc.).
   - Campos: tipo de gestión, fecha, descripción, resultado.

2. **Historial de gestiones**
   - Lista cronológica de todas las gestiones registradas para el prospecto.
   - Filtro por tipo de gestión.

---

## 15. Solución de Problemas Comunes

### No puedo iniciar sesión

| Problema                      | Posible causa                        | Solución                                                                                                                              |
| ----------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| "Credenciales inválidas"      | RUT o contraseña incorrectos         | Verifique que el RUT esté escrito correctamente (con puntos y guión). Si olvidó su contraseña, contacte al administrador del sistema. |
| No redirige después del login | Problema de conexión con el servidor | Intente recargar la página. Si persiste, contacte a TI.                                                                               |
| Sesión expirada               | El token de autenticación caducó     | Vuelva a iniciar sesión.                                                                                                              |

### No veo ciertas opciones del menú

| Problema                            | Causa                                                                        |
| ----------------------------------- | ---------------------------------------------------------------------------- |
| No veo "Dashboard"                  | Su rol no tiene acceso a este módulo. Solo gerentes pueden ver el Dashboard. |
| No veo "Solicitudes de cotización"  | Este módulo es solo para Ejecutivos de Evaluación y Gerentes.                |
| No veo "Personal"                   | Solo gerentes pueden gestionar usuarios.                                     |
| No veo botones de "Cancelar póliza" | Solo gerentes pueden cancelar o reactivar pólizas.                           |

### La página no carga correctamente

1. **Solución rápida**: Presione `F5` o `Ctrl + R` para recargar la página.
2. **Solución avanzada**: Presione `Ctrl + Shift + R` para recarga forzada (limpia caché).
3. **Cierre sesión y vuelva a iniciar**: Si el problema persiste, cierre sesión y vuelva a ingresar.

### Error al guardar un formulario

1. Revise que todos los campos obligatorios estén completos.
2. Verifique que el RUT sea válido.
3. Si el problema persiste, intente recargar la página y volver a llenar el formulario.
4. Si el error continúa, contacte al administrador del sistema.

### No encuentro un prospecto en la lista

1. **Use los filtros**: Escriba el nombre o RUT en el campo de búsqueda.
2. **Revise los filtros activos**: Puede haber un filtro por estado o ejecutivo activo que esté ocultando resultados.
3. **Limpie los filtros**: Use el botón "Limpiar" para resetear todos los filtros.
4. **Verifique permisos**: Si fue asignado recientemente a un prospecto, puede que necesite recargar la página.

### Error al marcar una cuota como pagada

1. Verifique que la cuota no haya sido pagada anteriormente.
2. Confirme que tiene permisos para realizar esta acción (Gerentes, Ejecutivo Cobranza, Ejecutivo Comercial).
3. Si el problema persiste, contacte al administrador.

---

## Apéndice

### Atajos de navegación

| Acción             | Cómo hacerlo                               |
| ------------------ | ------------------------------------------ |
| Volver al inicio   | Haga clic en "Inicio" en la barra lateral  |
| Recargar página    | `F5` o `Ctrl + R`                          |
| Cerrar modal/panel | Haga clic fuera del modal o presione `Esc` |

### Glosario

| Término                         | Definición                                                                                   |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| **Prospecto**                   | Cliente potencial que aún no tiene una póliza activa.                                        |
| **Cliente**                     | Prospecto que ya tiene una póliza emitida o un proceso comercial cerrado exitosamente.       |
| **Cotización**                  | Oferta económica de una compañía de seguros para un riesgo específico.                       |
| **Estudio comercial**           | Documento que consolida las cotizaciones recibidas y recomienda la mejor opción.             |
| **Póliza**                      | Contrato de seguro formalizado entre el cliente y la compañía aseguradora.                   |
| **Prima**                       | Monto que paga el asegurado por la cobertura del seguro.                                     |
| **UF**                          | Unidad de Fomento, indicador económico chileno usado como referencia en contratos de seguro. |
| **Plan de pago**                | Calendario de cuotas para el pago de la prima.                                               |
| **Proceso comercial**           | Flujo de trabajo que abarca desde la captación del prospecto hasta la emisión de la póliza.  |
| **Condominio**                  | Inmueble con unidades privadas y áreas comunes (edificios, conjuntos habitacionales).        |
| **Administrador de condominio** | Persona o entidad responsable de la administración del condominio.                           |
| **Sucursal**                    | Oficina o ubicación física de la corredora de seguros.                                       |
| **Comunicado de gerencia**      | Mensaje informativo emitido por la gerencia para todos los usuarios del sistema.             |

---

_Fin del manual de usuario — CRM JEFSEI v1.0.0_
