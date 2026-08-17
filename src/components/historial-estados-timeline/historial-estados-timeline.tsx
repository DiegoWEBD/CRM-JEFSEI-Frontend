'use client'

import { HistorialEtapaResumen } from '@/aplicacion/procesos-comerciales/use-cases/obtener-historial-estado/dto/historial-etapa-resumen'
import { Skeleton } from '@/components/skeleton'

type HistorialEstadosTimelineProps = {
  historial: Record<string, HistorialEtapaResumen> | undefined
  cargando: boolean
}

export default function HistorialEstadosTimeline({
  historial,
  cargando,
}: HistorialEstadosTimelineProps) {
  return (
    <>
      <div className='border-t border-border/50 pt-3'>
        <p className='mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
          Historial de estados
        </p>
      </div>

      {cargando && (
        <div className='space-y-3 py-2'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='flex items-start gap-2'>
              <Skeleton className='mt-1 h-2 w-2 shrink-0 rounded-full' />
              <div className='flex-1 space-y-1.5'>
                <Skeleton className='h-3 w-28' />
                <Skeleton className='h-3 w-44' />
                <Skeleton className='h-3 w-36' />
              </div>
            </div>
          ))}
        </div>
      )}

      {historial && Object.keys(historial).length === 0 && (
        <p className='text-xs text-muted-foreground'>
          No hay historial de estados
        </p>
      )}

      {historial &&
        Object.entries(historial).map(([etapaNombre, etapaData]) => (
          <div key={etapaNombre}>
            <div className='flex items-center gap-2 py-1'>
              <span className='h-2 w-2 rounded-full bg-muted-foreground/40' />
              <span className='text-xs font-semibold text-foreground'>
                {etapaData.etapa}
              </span>
            </div>
            <div className='ml-4 space-y-3 border-l-2 border-border/50 pl-4'>
              {etapaData.estados.map((estado, estIdx) => (
                <div key={estIdx} className='relative'>
                  <div className='absolute -left-[1.35rem] top-1.5 h-2 w-2 rounded-full border-2 border-primary bg-background' />
                  <p className='text-xs font-medium text-foreground'>
                    {estado.estado}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    Por: {estado.registrado_por}
                  </p>
                  <p className='text-sm text-muted-foreground tabular-nums'>
                    {new Date(estado.fecha_registro).toLocaleDateString(
                      'es-CL',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    )}
                  </p>
                  {estado.observacion && (
                    <p className='mt-0.5 text-sm text-muted-foreground/80 italic'>
                      {estado.observacion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
    </>
  )
}
