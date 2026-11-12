import SolicitudCotizacionResumen from '@/dominio/solicitud-cotizacion-resumen/solicitud-cotizacion-resumen'

export interface ContadoresSolicitudesCotizacion {
  informacion_incompleta: number
  listas_para_cotizar: number
  cotizaciones_emitidas: number
  estudios_emitidos: number
}

export interface ObtenerTodasSolicitudesCotizacionResponse {
  data: SolicitudCotizacionResumen[]
  contadores: ContadoresSolicitudesCotizacion
  total: number
  pagina: number
  tamano_pagina: number
  total_paginas: number
}
