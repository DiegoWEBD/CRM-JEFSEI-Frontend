import { SolicitudCotizacionRequestBase } from './solicitud-cotizacion-request'

export interface SolicitudCotizacionUnidadesRequest extends SolicitudCotizacionRequestBase {
  tipo: 'unidades'
  nombre_excel: string
}
