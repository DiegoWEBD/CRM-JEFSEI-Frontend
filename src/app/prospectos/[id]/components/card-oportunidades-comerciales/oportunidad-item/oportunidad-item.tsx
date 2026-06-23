'use client'

import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Skeleton } from '@/components/skeleton'
import { ESTADO_COMERCIAL_BADGE } from '@/app/styles/estados/estado-comercial-badge'
import { ESTADO_PROSPECTO_LABELS } from '@/types/estados/estado-comercial-cliente'
import type { ProcesoComercial } from '@/dominio/proceso-comercial/proceso-comercial'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, Plus, Upload } from 'lucide-react'
import { useState } from 'react'
import { useObtenerSolicitudesPorProceso } from '@/hooks/solicitudes-cotizacion/use-obtener-solicitudes-por-proceso'
import SolicitudCotizacionItem from '../../card-solicitudes-cotizacion/solicitud-cotizacion-item/solicitud-cotizacion-item'
import DialogNuevaSolicitudCotizacion from '@/components/solicitud-cotizacion/dialog-nueva-solicitud-cotizacion'
import SheetRegistrarPoliza from '../sheet-registrar-poliza/sheet-registrar-poliza'
import AuthGuard from '@/components/layouts/guards/auth-guard'

type OportunidadItemProps = {
  proceso: ProcesoComercial
  idProspecto: number
  informacionCompleta: boolean
  nombreCliente: string
  lineaNegocioNombre: string
}

export default function OportunidadItem({
  proceso,
  idProspecto,
  informacionCompleta,
  nombreCliente,
  lineaNegocioNombre,
}: OportunidadItemProps) {
  const [expandido, setExpandido] = useState(false)
  const [openNuevaSolicitud, setOpenNuevaSolicitud] = useState(false)
  const [openRegistrarPoliza, setOpenRegistrarPoliza] = useState(false)
  const { data: solicitudes, isLoading } = useObtenerSolicitudesPorProceso(
    proceso.id,
  )

  return (
    <>
      <div
        className={cn(
          'rounded-md border border-border bg-card transition-colors',
          expandido && 'border-primary/30',
        )}
      >
        <button
          type='button'
          onClick={() => setExpandido(!expandido)}
          className='flex w-full items-center gap-3 px-3 py-2.5 text-left'
        >
          {expandido ? (
            <ChevronDown className='h-4 w-4 shrink-0 text-muted-foreground' />
          ) : (
            <ChevronRight className='h-4 w-4 shrink-0 text-muted-foreground' />
          )}

          <div className='flex min-w-0 flex-1 items-center gap-3'>
            <span className='truncate text-sm font-medium text-foreground'>
              {proceso.producto}
            </span>

            <Badge
              variant='outline'
              className={cn(
                'shrink-0 px-2 py-0.5 text-[10px] font-semibold leading-none',
                ESTADO_COMERCIAL_BADGE[
                  proceso.estado_actual.codigo as keyof typeof ESTADO_COMERCIAL_BADGE
                ] ?? 'border-border bg-muted/50 text-muted-foreground',
              )}
            >
              {ESTADO_PROSPECTO_LABELS[
                proceso.estado_actual.codigo as keyof typeof ESTADO_PROSPECTO_LABELS
              ] ?? proceso.estado_actual.nombre}
            </Badge>

            {proceso.cerrado && (
              <Badge
                variant='outline'
                className='shrink-0 border-muted-foreground/30 bg-muted/30 px-2 py-0.5 text-[10px] font-semibold leading-none text-muted-foreground'
              >
                Cerrado
              </Badge>
            )}
          </div>

          <span className='shrink-0 text-[11px] text-muted-foreground'>
            {proceso.ejecutivo_comercial?.nombre ?? '—'}
          </span>
        </button>

        {expandido && (
          <div className='border-t border-border/50 px-3 pb-3 pt-2'>
            {isLoading ? (
              <div className='space-y-2'>
                <Skeleton className='h-12 w-full' />
                <Skeleton className='h-12 w-full' />
              </div>
            ) : solicitudes && solicitudes.length > 0 ? (
              <ul className='space-y-2'>
                {solicitudes.map((solicitud) => (
                  <SolicitudCotizacionItem
                    key={solicitud.id}
                    solicitud={solicitud}
                    informacionCompleta={informacionCompleta}
                    idProspecto={idProspecto}
                    nombreCliente={nombreCliente}
                    lineaNegocioNombre={lineaNegocioNombre}
                  />
                ))}
              </ul>
            ) : (
              <p className='py-2 text-center text-xs text-muted-foreground'>
                No hay solicitudes de cotización para esta oportunidad.
              </p>
            )}

            {!proceso.cerrado && (
              <AuthGuard allowedRoles={['EJECUTIVO_COMERCIAL']}>
                <div className='mt-2 flex items-center gap-2 border-t border-border/30 pt-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='h-7 gap-1 text-xs shadow-none'
                    onClick={() => setOpenRegistrarPoliza(true)}
                  >
                    <Upload className='h-3 w-3' aria-hidden />
                    Subir póliza
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='h-7 gap-1 text-xs shadow-none'
                    onClick={() => setOpenNuevaSolicitud(true)}
                  >
                    <Plus className='h-3 w-3' aria-hidden />
                    Nueva solicitud
                  </Button>
                </div>
              </AuthGuard>
            )}
          </div>
        )}
      </div>

      <DialogNuevaSolicitudCotizacion
        open={openNuevaSolicitud}
        onOpenChange={setOpenNuevaSolicitud}
        idProspecto={idProspecto}
        nombreCliente={nombreCliente}
        lineaNegocioNombre={lineaNegocioNombre}
        tipoPredefinido={proceso.tipo_producto}
        idProceso={proceso.id}
      />

      <SheetRegistrarPoliza
        open={openRegistrarPoliza}
        onOpenChange={setOpenRegistrarPoliza}
        idProceso={proceso.id}
        idProspecto={idProspecto}
        nombreCliente={nombreCliente}
        producto={proceso.producto}
      />
    </>
  )
}
