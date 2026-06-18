import { SolicitudCotizacionRequestBase } from './solicitud-cotizacion-request'

export interface SolicitudCotizacionUnidadesRequest extends SolicitudCotizacionRequestBase {
  tipo: 'unidades'
  monto_asegurado_total: number
  nombre_excel: string
}
