'use client'

import type { ReporteProcesoComercial, ReporteProcesoComercialAbierto } from '@/aplicacion/procesos-comerciales/dto/reporte-proceso-comercial'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/sheet'
import { Button } from '@/components/button'
import Link from 'next/link'
import { ScrollArea } from '@/components/scroll-area'
import { cn } from '@/lib/utils'
import { ESTADO_COMERCIAL_BADGE } from '@/app/styles/estados/estado-comercial-badge'
import { ESTADO_PROSPECTO_LABELS } from '@/types/estados/estado-comercial-cliente'

function esAbierto(r: ReporteProcesoComercial): r is ReporteProcesoComercialAbierto {
  return 'dias_transcurridos' in r
}

const PRIORIDAD_BADGE: Record<string, string> = {
  ROJO: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
  AMARILLO: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
  VERDE: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
  NO_APLICA: 'bg-muted text-muted-foreground ring-1 ring-inset ring-border',
}

const PRIORIDAD_LABELS: Record<string, string> = {
  ROJO: 'Atrasado',
  AMARILLO: 'En riesgo',
  VERDE: 'En plazo',
  NO_APLICA: '—',
}

const PRIORIDAD_ICON: Record<string, string> = {
  ROJO: 'bg-red-500',
  AMARILLO: 'bg-amber-400',
  VERDE: 'bg-emerald-500',
  NO_APLICA: 'bg-muted-foreground/40',
}

type DetalleProcesoDrawerProps = {
  reporte: ReporteProcesoComercial | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DetalleProcesoDrawer({
  reporte,
  open,
  onOpenChange,
}: DetalleProcesoDrawerProps) {
  if (!reporte) return null

  const { proceso } = reporte
  const abierto = esAbierto(reporte)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col gap-0 p-0 sm:max-w-md'>
        <SheetHeader className='border-b border-border px-4 py-3'>
          <div className='flex items-center gap-2'>
            <span
              className={cn(
                'h-3 w-3 shrink-0 rounded-full',
                PRIORIDAD_ICON[reporte.estado_semaforo],
              )}
            />
            <SheetTitle className='text-sm font-semibold'>
              {proceso.nombre_cliente}
            </SheetTitle>
          </div>
          <p className='text-xs text-muted-foreground'>{proceso.producto}</p>
          <Link
            href={`/prospectos/${proceso.id_prospecto}`}
            className='mt-1 text-[11px] text-primary underline-offset-2 hover:underline'
            target='_blank'
            rel='noopener noreferrer'
          >
            Ver prospecto →
          </Link>
        </SheetHeader>

        <ScrollArea className='flex-1 px-4 py-3'>
          <dl className='space-y-3 text-sm'>
            <div className='flex items-center justify-between'>
              <dt className='text-xs text-muted-foreground'>Prioridad</dt>
              <dd>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold leading-none',
                    PRIORIDAD_BADGE[reporte.estado_semaforo],
                  )}
                >
                  {PRIORIDAD_LABELS[reporte.estado_semaforo]}
                </span>
              </dd>
            </div>

            <div className='flex items-center justify-between'>
              <dt className='text-xs text-muted-foreground'>Etapa actual</dt>
              <dd className='font-medium text-foreground'>
                {proceso.etapa_actual.nombre}
              </dd>
            </div>

            <div className='flex items-center justify-between'>
              <dt className='text-xs text-muted-foreground'>Estado</dt>
              <dd>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold leading-none',
                    ESTADO_COMERCIAL_BADGE[proceso.estado_actual.codigo as keyof typeof ESTADO_COMERCIAL_BADGE] ?? 'border-border bg-muted/50 text-muted-foreground',
                  )}
                >
                  {ESTADO_PROSPECTO_LABELS[proceso.estado_actual.codigo as keyof typeof ESTADO_PROSPECTO_LABELS] ?? proceso.estado_actual.nombre}
                </span>
              </dd>
            </div>

            <div className='flex items-center justify-between'>
              <dt className='text-xs text-muted-foreground'>Ejecutivo comercial</dt>
              <dd className='font-medium text-foreground'>
                {proceso.ejecutivo_comercial?.nombre ?? '—'}
              </dd>
            </div>

            {proceso.ejecutivo_evaluacion && (
              <div className='flex items-center justify-between'>
                <dt className='text-xs text-muted-foreground'>Ejecutivo evaluación</dt>
                <dd className='font-medium text-foreground'>
                  {proceso.ejecutivo_evaluacion.nombre}
                </dd>
              </div>
            )}

            {abierto && (
              <>
                <div className='border-t border-border/50 pt-3'>
                  <p className='mb-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
                    SLA
                  </p>
                </div>

                <div className='flex items-center justify-between'>
                  <dt className='text-xs text-muted-foreground'>Fecha ingreso etapa</dt>
                  <dd className='font-medium tabular-nums text-foreground'>
                    {new Date(reporte.fecha_ingreso_etapa).toLocaleDateString('es-CL', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </dd>
                </div>

                <div className='flex items-center justify-between'>
                  <dt className='text-xs text-muted-foreground'>Días transcurridos</dt>
                  <dd className='font-medium tabular-nums text-foreground'>
                    {reporte.dias_transcurridos}
                  </dd>
                </div>

                <div className='flex items-center justify-between'>
                  <dt className='text-xs text-muted-foreground'>Límite SLA</dt>
                  <dd className='font-medium tabular-nums text-foreground'>
                    {proceso.etapa_actual.dias_limite != null
                      ? `${proceso.etapa_actual.dias_limite} días`
                      : 'Sin límite'}
                  </dd>
                </div>

                <div className='flex items-center justify-between'>
                  <dt className='text-xs text-muted-foreground'>% SLA consumido</dt>
                  <dd>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold leading-none',
                        reporte.porentaje_sla_consumido >= 1
                          ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                          : reporte.porentaje_sla_consumido >= 0.7
                            ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                            : 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
                      )}
                    >
                      {(reporte.porentaje_sla_consumido * 100).toFixed(0)}%
                    </span>
                  </dd>
                </div>

                {reporte.dias_restantes >= 0 ? (
                  <div className='flex items-center justify-between'>
                    <dt className='text-xs text-muted-foreground'>Días restantes</dt>
                    <dd className='font-medium tabular-nums text-foreground'>
                      {reporte.dias_restantes}
                    </dd>
                  </div>
                ) : null}

                {reporte.dias_atraso > 0 ? (
                  <div className='flex items-center justify-between'>
                    <dt className='text-xs text-muted-foreground'>Días de atraso</dt>
                    <dd className='font-medium tabular-nums text-red-600'>
                      {reporte.dias_atraso}
                    </dd>
                  </div>
                ) : null}

                <div className='rounded-md border border-border/70 bg-muted/20 p-2.5'>
                  <dt className='text-xs text-muted-foreground'>Mensaje</dt>
                  <dd className='mt-1 text-sm font-medium text-foreground'>
                    {reporte.mensaje_semaforo}
                  </dd>
                </div>
              </>
            )}

            {!abierto && (
              <div className='rounded-md border border-border/70 bg-muted/20 p-2.5'>
                <p className='text-xs text-muted-foreground'>
                  Proceso {proceso.estado_actual.nombre.toLowerCase()}.
                </p>
              </div>
            )}
          </dl>
        </ScrollArea>

        <SheetFooter className='border-t border-border px-4 py-3'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='w-full text-xs shadow-none'
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
