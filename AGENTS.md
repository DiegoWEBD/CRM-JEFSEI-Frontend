<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Current Summary

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
