import { HistorialEstadoResumen } from './historial-estado-resumen'

export interface HistorialEtapaResumen {
  etapa: string
  fecha_entrada_etapa: string
  estados: HistorialEstadoResumen[]
}
