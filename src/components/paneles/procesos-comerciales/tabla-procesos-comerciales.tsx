'use client'

import type { ReporteProcesoComercial, ReporteProcesoComercialAbierto } from '@/aplicacion/procesos-comerciales/dto/reporte-proceso-comercial'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table'
import { Card, CardContent } from '@/components/card'
import { SkeletonTabla } from './skeleton-tabla'
import { cn } from '@/lib/utils'
import { ESTADO_COMERCIAL_BADGE } from '@/app/styles/estados/estado-comercial-badge'
import { ESTADO_PROSPECTO_LABELS } from '@/types/estados/estado-comercial-cliente'

const PRIORIDAD_ORDER: Record<string, number> = {
  ROJO: 0,
  AMARILLO: 1,
  VERDE: 2,
  NO_APLICA: 3,
}

const PRIORIDAD_COLORS: Record<string, string> = {
  ROJO: 'bg-red-500',
  AMARILLO: 'bg-amber-400',
  VERDE: 'bg-emerald-500',
  NO_APLICA: 'bg-muted-foreground/40',
}

const PRIORIDAD_LABELS: Record<string, string> = {
  ROJO: 'Atrasado',
  AMARILLO: 'En riesgo',
  VERDE: 'En plazo',
  NO_APLICA: '—',
}

const headClass =
  'h-9 border-b border-border/50 bg-muted/20 px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'

const cellClass = 'px-3 py-2.5 align-middle'

function esAbierto(r: ReporteProcesoComercial): r is ReporteProcesoComercialAbierto {
  return 'dias_transcurridos' in r
}

type TablaProcesosComercialesProps = {
  filas: ReporteProcesoComercial[]
  isFetching: boolean
  onSeleccionar: (fila: ReporteProcesoComercial) => void
}

export default function TablaProcesosComerciales({
  filas,
  isFetching,
  onSeleccionar,
}: TablaProcesosComercialesProps) {
  if (isFetching && filas.length === 0) {
    return <SkeletonTabla />
  }

  if (filas.length === 0) {
    return (
      <div className='flex items-center justify-center py-12'>
        <p className='text-sm text-muted-foreground'>
          No hay registros que coincidan con los filtros.
        </p>
      </div>
    )
  }

  const ordenadas = [...filas].sort(
    (a, b) =>
      (PRIORIDAD_ORDER[a.estado_semaforo] ?? 99) -
      (PRIORIDAD_ORDER[b.estado_semaforo] ?? 99),
  )

  return (
    <>
      <div className='space-y-3 lg:hidden'>
        {ordenadas.map((f, i) => (
          <Card
            key={`${f.proceso.id}-${i}`}
            role='button'
            tabIndex={0}
            onClick={() => onSeleccionar(f)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSeleccionar(f)
              }
            }}
            className='cursor-pointer border-border bg-card shadow-none transition-colors hover:bg-muted/50'
          >
            <CardContent className='p-4'>
              <div className='flex items-start justify-between gap-2'>
                <div className='flex items-center gap-2 min-w-0'>
                  <span
                    className={cn(
                      'mt-0.5 h-3 w-3 shrink-0 rounded-full',
                      PRIORIDAD_COLORS[f.estado_semaforo],
                    )}
                  />
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-semibold text-foreground'>
                      {f.proceso.nombre_cliente}
                    </p>
                    <p className='truncate text-xs text-muted-foreground'>
                      {f.proceso.producto}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none',
                    f.estado_semaforo === 'ROJO'
                      ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                      : f.estado_semaforo === 'AMARILLO'
                        ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                        : f.estado_semaforo === 'VERDE'
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                          : 'bg-muted text-muted-foreground ring-1 ring-inset ring-border',
                  )}
                >
                  {PRIORIDAD_LABELS[f.estado_semaforo]}
                </span>
              </div>

              <div className='mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-muted-foreground'>
                <span>Etapa: {f.proceso.etapa_actual.nombre}</span>
                <span>
                  Estado:{' '}
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none',
                      ESTADO_COMERCIAL_BADGE[f.proceso.estado_actual.codigo as keyof typeof ESTADO_COMERCIAL_BADGE] ?? 'border-border bg-muted/50 text-muted-foreground',
                    )}
                  >
                    {ESTADO_PROSPECTO_LABELS[f.proceso.estado_actual.codigo as keyof typeof ESTADO_PROSPECTO_LABELS] ?? f.proceso.estado_actual.nombre}
                  </span>
                </span>
                {esAbierto(f) && (
                  <>
                    <span>
                      Tiempo: {f.dias_transcurridos} / {f.proceso.etapa_actual.dias_limite ?? '—'} días
                    </span>
                    <span>
                      SLA:{' '}
                      {(f.porentaje_sla_consumido * 100).toFixed(0)}%
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='hidden max-h-[65vh] overflow-y-auto lg:block'>
        <Table className='min-w-[1200px] w-full border-separate border-spacing-0'>
          <TableHeader className='sticky top-0 z-10 bg-background'>
            <TableRow className='border-0 hover:bg-transparent'>
              <TableHead className={cn(headClass, 'w-10')}>
                <span className='sr-only'>Prioridad</span>
                <span aria-hidden className='inline-block h-3 w-3 rounded-full bg-current opacity-30' />
              </TableHead>
              <TableHead className={cn(headClass, 'w-[20%]')}>Cliente</TableHead>
              <TableHead className={cn(headClass, 'w-[11%]')}>Producto</TableHead>
              <TableHead className={cn(headClass, 'w-[11%]')}>Ejecutivo</TableHead>
              <TableHead className={cn(headClass, 'w-[9%]')}>Etapa</TableHead>
              <TableHead className={cn(headClass, 'w-[9%]')}>Estado</TableHead>
              <TableHead className={cn(headClass, 'w-[9%]')}>Tiempo etapa</TableHead>
              <TableHead className={cn(headClass, 'w-16')}>SLA límite</TableHead>
              <TableHead className={cn(headClass, 'w-16')}>% SLA</TableHead>
              <TableHead className={cn(headClass, 'w-[18%]')}>Mensaje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordenadas.map((f, i) => (
              <TableRow
                key={`${f.proceso.id}-${i}`}
                role='button'
                tabIndex={0}
                onClick={() => onSeleccionar(f)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSeleccionar(f)
                  }
                }}
                className='cursor-pointer border-0 border-b border-border/40 transition-colors last:border-b-0 hover:bg-muted/[0.35]'
              >
                <TableCell className={cn(cellClass, 'p-1.5 text-center')}>
                  <span
                    className={cn(
                      'inline-block h-3 w-3 rounded-full',
                      PRIORIDAD_COLORS[f.estado_semaforo],
                    )}
                  />
                </TableCell>
                <TableCell className={cn(cellClass, 'font-medium text-foreground')}>
                  <span className='break-words text-xs leading-snug'>
                    {f.proceso.nombre_cliente}
                  </span>
                </TableCell>
                <TableCell className={cn(cellClass, 'text-[11px] text-muted-foreground')}>
                  <span className='line-clamp-2 leading-snug'>
                    {f.proceso.producto}
                  </span>
                </TableCell>
                <TableCell className={cn(cellClass, 'text-[11px] text-muted-foreground')}>
                  {f.proceso.ejecutivo_comercial?.nombre ?? '—'}
                </TableCell>
                <TableCell className={cn(cellClass, 'text-[11px] text-muted-foreground')}>
                  {f.proceso.etapa_actual.nombre}
                </TableCell>
                <TableCell className={cn(cellClass, 'p-1.5')}>
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none',
                      ESTADO_COMERCIAL_BADGE[f.proceso.estado_actual.codigo as keyof typeof ESTADO_COMERCIAL_BADGE] ?? 'border-border bg-muted/50 text-muted-foreground',
                    )}
                  >
                    {ESTADO_PROSPECTO_LABELS[f.proceso.estado_actual.codigo as keyof typeof ESTADO_PROSPECTO_LABELS] ?? f.proceso.estado_actual.nombre}
                  </span>
                </TableCell>
                <TableCell className={cn(cellClass, 'text-[11px] tabular-nums text-muted-foreground')}>
                  {esAbierto(f) ? `${f.dias_transcurridos} días` : '—'}
                </TableCell>
                <TableCell className={cn(cellClass, 'text-[11px] tabular-nums text-muted-foreground')}>
                  {esAbierto(f) && f.proceso.etapa_actual.dias_limite != null
                    ? `${f.proceso.etapa_actual.dias_limite} días`
                    : '—'}
                </TableCell>
                <TableCell className={cn(cellClass, 'p-1.5')}>
                  {esAbierto(f) ? (
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none',
                        f.porentaje_sla_consumido >= 1
                          ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                          : f.porentaje_sla_consumido >= 0.7
                            ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                            : 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
                      )}
                    >
                      {(f.porentaje_sla_consumido * 100).toFixed(0)}%
                    </span>
                  ) : (
                    <span className='text-[10px] text-muted-foreground'>—</span>
                  )}
                </TableCell>
                <TableCell className={cn(cellClass, 'text-[11px] text-muted-foreground')}>
                  <span className='line-clamp-2 leading-snug'>
                    {esAbierto(f) ? f.mensaje_semaforo : '—'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
