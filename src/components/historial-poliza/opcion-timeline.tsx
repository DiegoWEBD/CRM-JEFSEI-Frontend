import { HistorialEstadoJson } from '@/aplicacion/procesos-comerciales/use-cases/obtener-historial-estado/dto/historial-estado-json'
import HistorialEstadosTimeline from '@/components/historial-estados-timeline/historial-estados-timeline'

type OpcionTimelineProps = {
  historial: HistorialEstadoJson[] | undefined
  cargando: boolean
}

export function OpcionTimeline({ historial, cargando }: OpcionTimelineProps) {
  return <HistorialEstadosTimeline historial={historial} cargando={cargando} />
}
