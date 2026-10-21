import { SolicitudCotizacionGenericaRequest } from './solicitud-cotizacion-generica-request'
import { SolicitudCotizacionVidaGuardiaRequest } from './solicitud-cotizacion-vida-guardia-request'
import { SolicitudCotizacionResponsabilidadCivilRequest } from './solicitud-cotizacion-responsabilidad-civil-request'
import { SolicitudCotizacionAccidentesPersonalesRequest } from './solicitud-cotizacion-accidentes-personales-request'

export type SolicitudCotizacionUnionRequest =
  | SolicitudCotizacionGenericaRequest
  | SolicitudCotizacionVidaGuardiaRequest
  | SolicitudCotizacionResponsabilidadCivilRequest
  | SolicitudCotizacionAccidentesPersonalesRequest
