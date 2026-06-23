import { SolicitudCotizacionRequestBase } from './solicitud-cotizacion-request'

export interface SolicitudCotizacionResponsabilidadCivilRequest extends SolicitudCotizacionRequestBase {
  tipo: 'rc_condominio'
  actividad_del_condominio: string
  limite: number
}
