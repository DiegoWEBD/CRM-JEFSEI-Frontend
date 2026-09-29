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
- **Campana**: `src/components/header/campana-notificaciones/campana-notificaciones.tsx` — popover con badge de contador, lista no leídas, click marca leída y navega a `url_destino`, "Marcar todas". Usa el item compartido `src/components/notificaciones/item-notificacion/item-notificacion.tsx`.
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

**Pre-existing lint issues (not from our work)**:
- `campos-condominio-registrar.tsx:35`: `@typescript-eslint/no-explicit-any`
- `use-mobile.tsx:14`: `react-hooks/set-state-in-effect` (React 19 lint rule)
