'use client'

import HistorialEstadosTimeline from '@/components/historial-estados-timeline/historial-estados-timeline'
import { HistorialEtapaResumen } from '@/aplicacion/procesos-comerciales/use-cases/obtener-historial-estado/dto/historial-etapa-resumen'

type OpcionTimelineProps = {
  historial: Record<string, HistorialEtapaResumen> | undefined
  cargando: boolean
}

export function OpcionTimeline({ historial, cargando }: OpcionTimelineProps) {
  return <HistorialEstadosTimeline historial={historial} cargando={cargando} />
}
