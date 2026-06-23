import { SolicitudCotizacionRequestBase } from './solicitud-cotizacion-request'

export type TipoSolicitudGenerica = 'vehiculos' | 'hogar' | 'vida' | 'salud_complementario' | 'mascotas' | 'espacios_comunes'

export interface SolicitudCotizacionGenericaRequest extends SolicitudCotizacionRequestBase {
  tipo: TipoSolicitudGenerica
}
