'use client'

import { Skeleton } from '@/components/skeleton'
import { HistorialEstadoJson } from '@/aplicacion/procesos-comerciales/use-cases/obtener-historial-estado/dto/historial-estado-json'

type OpcionListaPlanaProps = {
  historial: HistorialEstadoJson[] | undefined
  cargando: boolean
}

export function OpcionListaPlana({ historial, cargando }: OpcionListaPlanaProps) {
  if (cargando) {
    return (
      <div className='space-y-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='flex items-center gap-3 border-b border-border py-2'>
            <Skeleton className='h-3 w-20' />
            <Skeleton className='h-3 w-24' />
            <Skeleton className='h-3 w-36' />
          </div>
        ))}
      </div>
    )
  }

  if (!historial || historial.length === 0) {
    return (
      <p className='text-xs text-muted-foreground'>
        No hay historial de estados
      </p>
    )
  }

  return (
    <div className='divide-y divide-border'>
      {historial.map((item, idx) => (
        <div key={idx} className='flex items-center gap-3 py-2 text-xs'>
          <span className='w-20 shrink-0 tabular-nums text-muted-foreground'>
            {new Date(item.fecha_registro).toLocaleDateString('es-CL', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <span className='w-24 shrink-0 font-medium text-foreground'>
            {item.registrado_por.nombre}
          </span>
          <span className='flex-1 text-muted-foreground'>
            {item.estado.nombre}
          </span>
          <span className='hidden rounded-sm border border-border bg-muted/50 px-1.5 py-0.5 text-xs text-muted-foreground sm:inline-block'>
            {item.estado.etapa.nombre}
          </span>
        </div>
      ))}
    </div>
  )
}
