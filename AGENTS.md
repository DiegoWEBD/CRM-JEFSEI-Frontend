<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Current Summary

**Notificaciones / campana header + refresh por WebSocket: DONE**

- **Tipos**: `src/types/notificaciones/notificacion.ts` (Notificacion, paginado, contador, responses, `TicketWebSocketResponse`, `EventoCanalNotificaciones`).
- **BFF**: `/api/notificaciones` (GET), `/api/notificaciones/contador`, `/api/notificaciones/[id]/leer` (PATCH), `/api/notificaciones/leer-todas` (POST), `/api/auth/ws-ticket` (POST).
- **Use cases server**: `src/aplicacion/notificaciones/use-cases/*` con cookies → axiosClient al backend. El del ticket: `obtener-ticket-websocket`.
- **Hooks**: `use-notificaciones`, `use-contador-no-leidas` (**sin `refetchInterval`**), `use-marcar-notificacion-leida`, `use-marcar-notificaciones-leidas`, **`use-canal-notificaciones`**.
- **Campana**: `src/components/header/campana-notificaciones/campana-notificaciones.tsx` — popover con badge de contador, lista no leídas, click marca leída y navega a `/prospectos/${id_prospecto}`, "Marcar todas". Usa el item compartido `src/components/notificaciones/item-notificacion/item-notificacion.tsx`.
- **Header**: montada en `header-client.tsx` junto al usuario.
- **Sin polling**: el backend avisa por **WebSocket** (`ws://…/ws/notificaciones?ticket=…`) con `{"evento":"notificaciones_actualizadas"}` y el cliente hace `invalidateQueries(['notificaciones'])`.
  - Canal: `src/hooks/notificaciones/use-canal-notificaciones.ts` + `src/components/providers/canal-notificaciones.tsx`, montado en `providers.tsx` dentro de `AuthProvider` (solo con `VER_ALERTAS`).
  - Reconecta con backoff 1s→30s pidiendo ticket nuevo; **no** reintenta ante cierre `1008` ni ante `401/403` del ticket; al reconectar invalida para recuperar lo perdido.
  - Ticket: el navegador no puede leer la cookie httpOnly `token`, así que el BFF la cambia por un JWT de 60 s con `proposito='ws'`.
  - El socket habla **directo con FastAPI** (un route handler de Next no puede terminar un WS); el origen se valida a mano (`CRM_ORIGENES_PERMITIDOS`), cierre `1008`.
  - Detalles y deuda: `alertas.md` §5.3, §6.5 y §9.

**Rediseño del home (`/`) + KPIs a `/prospectos`: DONE**

- **Home** (`panel-home-client.tsx`): ya no tiene `PanelKpiContainer` ni `CardProspectosClient`. Ahora es "pendientes": bienvenida → `MetricasEjecutivoComercial` → **sección Alertas** → `CardCalendario` → `CardComunicadoGerencia`.
- **Alertas del home**: `src/components/paneles/home/alertas-ejecutivo/` (`alertas-ejecutivo.tsx` + skeleton), bajo `PermissionGuard ['VER_ALERTAS']`. Dos grupos (`lg:grid-cols-2`): **Críticas** (`CRITICO`) y **Avisos** (`AVISO`), solo no leídas, top 5 + `Paginacion` propia por grupo, total por grupo, "N sin leer" y "Marcar todas leídas". Al marcar se reinicia la página del grupo.
- **`/prospectos`**: `src/components/prospectos/panel-prospectos/` (`panel-prospectos.tsx` SSR → `panel-prospectos-client.tsx` → KPIs + tabla). Los 9 KPI migraron a `src/components/prospectos/kpis-prospectos/kpis-prospectos.tsx` y **conservan el click-filtro** sobre `CardProspectosClient` (`filtroExterno`/`onFiltroChange`). `page.tsx` quedó en `Suspense + PanelProspectosSkeleton`.
- **Borrado**: `src/components/prospectos/card-prospectos/card-prospectos.tsx` (el wrapper server ya no se usa).
- Backend: router `/notificaciones` registrado, APScheduler (`CRM_INICIAR_SCHEDULER`, intervalo `CRM_SCHEDULER_INTERVALO_MINUTOS`) genera alertas SLA. **Quien cambia el estado publica en el hub desde el use case** (generar alertas, marcar leída, marcar todas); el router y el scheduler no tienen side effects de tiempo real.

**E3 Frontend — Cotizaciones/Estudios Emitidos panel: DONE**

All components are built:
- **BFF aggregator** (`/api/panel-estudios`): returns wrapper `{ data: [...] }` — this was a runtime fix; the original endpoint returned items directly, causing a deserialization crash. Fixed by returning wrapper.
- **SSR page** (`page.tsx`): uses `Suspense` boundary + `initialData` prefetch via `HydrationBoundary` for instant table render.
- **KPIs** (`kpis-cotizaciones-estudios-emitidos.tsx`): 4 cards — Pendientes, Opciones recibidas, Aseguradoras contactadas, Estudios emitidos. Skeleton transitions while loading. Labels corrected from genérico to match prototype.
- **Table** (`tabla-cotizaciones-estudios-emitidos.tsx`): sortable by any column, click-to-expand row, reordered columns with vencimiento as standalone column using vencimiento-cell.
- **Vencimiento cell** (`vencimiento-cell.tsx`): emits colored badges — green "Vigente", amber "Por vencer", red "Vencida hace X días". Relative text based on calendar-day diff.
- **Dialog Ver Cotizaciones** (`dialog-ver-cotizaciones.tsx`): prototype-matching layout — header with border, summary row (Cliente, Línea, Ejecutivo, Opciones), table (Compañía, Monto asegurado, Vencimiento, Estado venc.), footer with Cerrar. Uses ScrollArea, skeleton loaders.
- **Dialog Generar Estudio** (`dialog-generar-estudio.tsx`): radio group of cotizaciones to select recommended option, plus observaciones textarea and file upload. No set-state-in-effect (fixed via `handleOpenChange`).
- **Dialog Ver Estudio** (`dialog-ver-estudio.tsx`): shows estudio details with download link if PDF available.
- **Skeletons**: used everywhere — KPIs, table body, dialog content, vencimiento badges.
- **SSR + initialData**: page fetches on server, passes `initialData` to QueryClient, table uses that data. Suspense fallback renders skeletons.

**Lineamientos seguidos**: skeletons en estados de carga, Suspense con SSR, initialData para hidratación instantánea, ScrollArea en tablas largas, layout consistente en dialogs (header+border / scroll-body / footer).

**Recordatorios — usuario destino en `POST /recordatorios`: DONE**

- **Hook** (`src/hooks/recordatorios/use-registrar-recordatorio.ts`): `RegistrarRecordatorioRequest` incluye `rut_usuario_destino?: string | null`.
- **Dialog** (`src/components/dialog-crear-recordatorio/dialog-crear-recordatorio.tsx`): con el permiso `CREAR_RECORDATORIO_GLOBAL` (solo al crear, no en edición) se muestra el Select "Asignar a (opcional)" con los usuarios (`useUsuarios`, 100/página). Opción por defecto "Para mí" (→ `rut_usuario_destino: null`); el BFF `POST /api/recordatorios` reenvía el body tal cual, sin cambios.
- **Tests** (`src/components/dialog-crear-recordatorio/__tests__/dialog-crear-recordatorio-destino.test.tsx`): visibilidad por permiso/edición y envío del destino. Nota: Radix renderiza un `BubbleSelect` nativo que duplica el texto de las opciones dentro de `<form>`; usar `findByRole('option', { name })` para hacer click en el item.
- **Backend** (ya implementado): permisos `CREAR_RECORDATORIO_PROPIO`/`CREAR_RECORDATORIO_GLOBAL` (`migraciones/migracion_permisos_crear_recordatorio.sql`), el caso de uso valida el destino y la auditoría describe "…para el usuario X en el prospecto Y".

**403 → vista genérica "Sin permisos": DONE**

- **Problema**: un 403 del backend (p. ej. ejecutivo que ya no está asignado a un prospecto) mostraba el error genérico de `ErrorFallback`. En render de servidor el error llega serializado a `error.tsx` (en producción solo sobrevive `digest`), así que `axios.isAxiosError(error)` no lo detecta.
- **Mecanismo**: `src/lib/errores.ts` expone `DIGEST_SIN_PERMISOS`, `marcarErrorSinPermisos(error)` (estampa `digest = 'SIN_PERMISOS'` **sin reemplazar el AxiosError**, porque el BFF reenvía status/mensaje con `normalizarErrorServidor`) y `esErrorSinPermisos(error)`. Next respeta un `digest` preexistente en el error (verificado en `create-error-handler.js`), así que el marcador cruza la serialización Server → Client.
- **Interceptores**: `axios-client.ts` (servidor) y `client-axios.ts` (navegador) estampan el digest en cualquier respuesta 403. El flujo 401 (refresh → retry → logout) queda intacto; el 403 es denegación definitiva: **sin refresh ni redirect**.
- **Vista**: `error-fallback.tsx` muestra "Sin permisos" (ShieldAlert + "No tienes permiso para acceder a este recurso…" + "Volver al inicio") para `esErrorSinPermisos(error)`, `UnauthorizedError` o axios 401. La rama genérica "Error / Reintentar" queda para el resto.
- **Tests**: `src/lib/__tests__/errores.test.ts`, `src/infraestructura/axios/__tests__/axios-client.test.ts`, caso nuevo en `client-axios.test.ts` y `src/components/error-fallback/__tests__/error-fallback.test.tsx` (incluye el error serializado de SSR).

**Pre-existing lint issues (not from our work)**:
- `campos-condominio-registrar.tsx:35`: `@typescript-eslint/no-explicit-any`
- `use-mobile.tsx:14`: `react-hooks/set-state-in-effect` (React 19 lint rule)
