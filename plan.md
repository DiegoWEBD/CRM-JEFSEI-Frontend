# Plan de trabajo — Sistema CRM

> Última actualización: 13-08-2026

Resumen del refactor visual del frontend: aplicar el sistema de tokens semánticos (`--color-*`) a todos los módulos, eliminando colores hardcoded, y unificar patrones de componentes.

## Fases completadas

### F4 — Paneles tabulares (completada ✅)
Oportunidades, Solicitudes de estudio, Cotizaciones/estudios emitidos — unificación del patrón **KPIs + Filtros + Tabla**.

- **Nuevo componente compartido**: `src/components/paneles/shared/panel-kpi-card/panel-kpi-card.tsx` (`PanelKpiCard` + `PanelKpiSkeleton`), con acentos semánticos `info/success/primary/warning/danger`.
- **KPIs**: los 3 paneles refactorizados al componente compartido; eliminado `console.log` residual en `kpi-cotizaciones-estudios.tsx`.
- **Filtros**: contenedor `flex flex-wrap items-center gap-2`, search `h-9 pl-8 text-xs`, selects `size=sm`, botón limpiar fantasma `h-9 text-xs`, contador "Mostrando X de Y" en los 3.
- **Tablas**: `headClass` y `cellClass` unificadas, `section` wrapper `overflow-hidden rounded-lg border bg-card`, semáforos/estados con `<Badge variant>` (`SEMAFORO_VARIANT`, `VENCIMIENTO_VARIANT`).
- **Tokens**: `PRIORIDAD_COLORS` → `bg-destructive/bg-warning/bg-success`; `PRIORIDAD_DOT` en el drawer; bloque GANADO/PERDIDO cerrado del drawer → `border-success/30 bg-success/10` + `text-success` (y `destructive`); `CircleAlert text-amber-500` → `text-warning`.

### F5 — Dashboard gerente (completada ✅)
- `src/lib/paleta-dashboard.ts`: arrays hex hardcoded → tokens `--chart-1..5` (usa `var(--chart-N)` directo, las variables son `oklch()`).
- Limpieza de teal hardcoded en 6 archivos: grids `stroke-teal-500/10` → `stroke-border`; cursores `rgba(20,184,166,0.12)` → `hsl(var(--primary) / 0.08)`; tooltip custom muerto simplificado; leyenda donut (concatenación de alpha hex `${fill}18` era inválida con `var()`) → `backgroundColor: fill` + `text-white`; fondos `bg-teal-500/[0.06]` → `bg-secondary/60`; `ring-teal-500/15` → `ring-primary/15`; `text-teal-700 dark:text-teal-300` → `text-primary`.

### F6 — Ficha cliente `prospectos/[id]` (completada ✅)
- Patrón "pendiente/obligatorio" (ámbar) → token `warning`: `item-informacion-prospecto`, helper `inp()` y sus 20 ocurrencias en 4 formularios, banner `AlertTriangle`.
- KPIs de pólizas: `emerald` → `success`, `sky` → `info`, `amber` → `warning`.
- Chips de vencimiento `ESTADO_VENC_COLORS` → clases de `success/warning/destructive` (alineadas a las variants del Badge); `FileText text-red-500` → `text-destructive`.
- Badge "Información incompleta" `sky` → `info`.
- Verificación en todas las fases: `npm run build` ✓ (37/37 rutas) y `npm run lint` = 45 problemas (5 errors / 40 warnings) baseline, **0 nuevos**.

## Fase pendiente (mañana)

### F7 — Formularios de registro
Unificar la validación visual y el patrón de secciones en los formularios de registro del sistema.

**Antes de empezar**: revisar `npm run build` y `npm run lint` para confirmar estado de línea base.

**Alcance propuesto**:
1. Explorar el/los directorio(s) de formularios de registro en `frontend/src` (p.ej. prospectos, condominios, pólizas, solicitudes, usuarios/personal) y mapear:
   - Estructura de secciones/campos de cada uno.
   - Patrón de validación visual actual (mensajes de error, resaltado de campos requeridos, helper `inp()` compartido de F6).
   - Colores hardcoded restantes (ámbar pendiente, rojo/error, etc.) para migrar a tokens `--color-*`.
   - Tipografía/padding de inputs y labels (consistencia con `h-9 text-sm shadow-none` de F4/F6).
2. Unificar:
   - Contenedor de secciones (título + descripción + borde/card densa).
   - Inputs: `h-9 text-sm shadow-none`, labels `text-xs`/`text-[10px]` muted.
   - Mensajes de error: usar tokens `destructive` (no `text-red-*`).
   - Resaltado de campos obligatorios pendientes: reutilizar `inp(pendiente, extra)` de F6.
   - Botones de submit (primario `text-sm`).
3. Limpiar cualquier color hardcoded encontrado (grep: `text-red-|text-amber-|bg-red-|bg-amber-|border-red-|border-amber-`).
4. **Verificación obligatoria**: `npm run build` ✓ y `npm run lint` sin problemas nuevos (mantener ≤ 45 problemas baseline).

**Notas/contexto útil para F7**:
- El helper compartido `inp(pendiente, extra?)` vive en `src/app/prospectos/[id]/components/card-informacion-prospecto/formulario-actualizar-prospecto/formulario-actualizar-prospecto.tsx` (L24-31) — candidato a promoverse a un módulo compartido (p.ej. `src/lib/form-utils.ts`) si se usa en varios formularios.
- `globals.css` `@theme inline` ya define `--color-destructive`, `--color-warning`, `--color-info`, `--color-success` (+ variantes light) — disponibles como clases `bg-*/text-*/border-*`.
- Los `pastel-*` del Badge y los mapas de `src/lib/badge-variants.ts` son el estándar para chips/badges de estado.
- Nota AGENTS.md (predeterminada): existen 2 lint issues preexistentes ajenos al refactor (`campos-condominio-registrar.tsx:35` `no-explicit-any`; `use-mobile.tsx:14` `set-state-in-effect`).

## Comandos útiles
```bash
# Construcción y tipado
npm run build        # dentro de frontend

# Lint
npm run lint         # dentro de frontend

# Búsqueda de colores hardcoded
rg "text-(red|amber|blue|sky|emerald)-[0-9]|bg-(red|amber|blue|sky|emerald)-[0-9]" src/app/prospectos frontend/src/components
```