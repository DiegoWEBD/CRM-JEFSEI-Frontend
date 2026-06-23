import { SolicitudCotizacionRequestBase } from './solicitud-cotizacion-request'

export interface ActividadAccidentesPersonales {
  actividad: string
  numero_asegurados: number
}

export interface SolicitudCotizacionAccidentesPersonalesRequest extends SolicitudCotizacionRequestBase {
  tipo: 'accidentes_personales'
  actividades: ActividadAccidentesPersonales[]
}
