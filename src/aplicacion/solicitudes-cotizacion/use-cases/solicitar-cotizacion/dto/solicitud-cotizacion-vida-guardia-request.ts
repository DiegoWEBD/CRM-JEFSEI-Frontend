import { SolicitudCotizacionRequestBase } from './solicitud-cotizacion-request'

export interface SolicitudCotizacionVidaGuardiaRequest extends SolicitudCotizacionRequestBase {
  tipo: 'vida_guardia'
  numero_guardias: number
}
