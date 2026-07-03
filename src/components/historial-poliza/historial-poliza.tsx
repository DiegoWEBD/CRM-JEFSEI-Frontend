'use client'

import { useState } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle'
import { HistorialEtapaResumen } from '@/aplicacion/procesos-comerciales/use-cases/obtener-historial-estado/dto/historial-etapa-resumen'
import { OpcionTimeline } from './opcion-timeline'
import { OpcionListaPlana } from './opcion-lista-plana'

type HistorialPolizaProps = {
  historial: Record<string, HistorialEtapaResumen> | undefined
  cargando: boolean
}

export function HistorialPoliza({ historial, cargando }: HistorialPolizaProps) {
  const [opcion, setOpcion] = useState<'timeline' | 'lista-plana'>('timeline')

  return (
    <div className='space-y-3'>
      <ToggleGroup
        type='single'
        value={opcion}
        onValueChange={(v) => {
          if (v) setOpcion(v as 'timeline' | 'lista-plana')
        }}
        variant='outline'
        size='sm'
      >
        <ToggleGroupItem value='timeline' className='text-[11px]'>
          Timeline
        </ToggleGroupItem>
        <ToggleGroupItem value='lista-plana' className='text-[11px]'>
          Lista plana
        </ToggleGroupItem>
      </ToggleGroup>

      {opcion === 'timeline' ? (
        <OpcionTimeline historial={historial} cargando={cargando} />
      ) : (
        <OpcionListaPlana historial={historial} cargando={cargando} />
      )}
    </div>
  )
}
