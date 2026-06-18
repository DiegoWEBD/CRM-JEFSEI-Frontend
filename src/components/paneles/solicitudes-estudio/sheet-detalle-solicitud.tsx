'use client'

import SolicitudCotizacionResumen from '@/dominio/solicitud-cotizacion-resumen/solicitud-cotizacion-resumen'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/sheet'
import { Separator } from '@/components/separator'
import { ScrollArea } from '@/components/scroll-area/scroll-area'
import { formatFechaCorta } from '@/utils/format-fecha-corta'
import { Button } from '@/components/button'
import BadgePrioridad from '@/components/badge-prioridad/badge-prioridad'
import BadgeEstadoSolicitud from './badge-estado-solicitud'
import { labelCampo } from '@/lib/etiquetas-campos-prospecto'
import { CircleAlert } from 'lucide-react'

function FilaDetalle({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='space-y-0.5'>
      <p className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
        {label}
      </p>
      <div className='text-sm text-foreground'>{children}</div>
    </div>
  )
}

function resolverEstado(s: SolicitudCotizacionResumen) {
  if (!s.informacion_completa) return 'informacion_incompleta' as const
  if (s.cantidad_cotizaciones > 0) return 'con_cotizaciones' as const
  return 'lista_para_cotizar' as const
}

type SheetDetalleSolicitudProps = {
  solicitud: SolicitudCotizacionResumen | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SheetDetalleSolicitud({
  solicitud,
  open,
  onOpenChange,
}: SheetDetalleSolicitudProps) {
  if (!solicitud) return null

  const estado = resolverEstado(solicitud)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full flex-col gap-0 p-0 sm:max-w-md'>
        <SheetHeader className='border-b border-border px-4 py-3 text-left'>
          <SheetTitle className='text-base leading-snug'>
            {solicitud.nombre_riesgo}
          </SheetTitle>
          <p className='text-xs text-muted-foreground'>{solicitud.producto}</p>
          <div className='mt-2'>
            <BadgeEstadoSolicitud estado={estado} />
          </div>
        </SheetHeader>

        <ScrollArea className='flex-1 px-4 py-3'>
          <div className='space-y-4 pr-2'>
            <FilaDetalle label='Ejecutivo comercial'>
              {solicitud.ejecutivo_comercial}
            </FilaDetalle>

            <FilaDetalle label='Fecha de solicitud'>
              <span className='tabular-nums'>
                {formatFechaCorta(solicitud.fecha)}
              </span>
            </FilaDetalle>

            <FilaDetalle label='Prioridad'>
              <BadgePrioridad prioridad={solicitud.prioridad} />
            </FilaDetalle>

            <Separator />

            <div className='space-y-2'>
              <h4 className='text-sm font-semibold'>Información faltante</h4>
              {solicitud.campos_faltantes.length > 0 ? (
                <div className='space-y-1.5'>
                  {solicitud.campos_faltantes.map((campo) => (
                    <div
                      key={campo}
                      className='flex items-center gap-2 text-sm'
                    >
                      <CircleAlert className='h-4 w-4 shrink-0 text-amber-500' />
                      <span className='text-muted-foreground'>
                        {labelCampo(campo)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-muted-foreground'>
                  No hay información faltante.
                </p>
              )}
            </div>
          </div>
        </ScrollArea>

        <div className='border-t border-border px-4 py-3'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-8 w-full text-xs'
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
