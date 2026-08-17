'use client'

import { Skeleton } from '@/components/skeleton'
import { HistorialEtapaResumen } from '@/aplicacion/procesos-comerciales/use-cases/obtener-historial-estado/dto/historial-etapa-resumen'

type OpcionListaPlanaProps = {
  historial: Record<string, HistorialEtapaResumen> | undefined
  cargando: boolean
}

type ItemPlano = {
  etapa: string
  estado: string
  registrado_por: string
  fecha: Date
}

function aplanarHistorial(
  historial: Record<string, HistorialEtapaResumen>,
): ItemPlano[] {
  const items: ItemPlano[] = []
  for (const etapaData of Object.values(historial)) {
    for (const estado of etapaData.estados) {
      items.push({
        etapa: etapaData.etapa,
        estado: estado.estado,
        registrado_por: estado.registrado_por,
        fecha: new Date(estado.fecha_registro),
      })
    }
  }
  items.sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
  return items
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

  if (!historial || Object.keys(historial).length === 0) {
    return (
      <p className='text-xs text-muted-foreground'>
        No hay historial de estados
      </p>
    )
  }

  const items = aplanarHistorial(historial)

  return (
    <div className='divide-y divide-border'>
      {items.map((item, idx) => (
        <div key={idx} className='flex items-center gap-3 py-2 text-xs'>
          <span className='w-20 shrink-0 tabular-nums text-muted-foreground'>
            {item.fecha.toLocaleDateString('es-CL', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <span className='w-24 shrink-0 font-medium text-foreground'>
            {item.registrado_por}
          </span>
          <span className='flex-1 text-muted-foreground'>
            {item.estado}
          </span>
          <span className='hidden rounded-sm border border-border bg-muted/50 px-1.5 py-0.5 text-xs text-muted-foreground sm:inline-block'>
            {item.etapa}
          </span>
        </div>
      ))}
    </div>
  )
}
