import type { UnidadAlicuotaRequest } from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import { SolicitudCotizacionRequestBase } from './solicitud-cotizacion-request'

export type { UnidadAlicuotaRequest }

export interface SolicitudCotizacionUnidadesRequest extends SolicitudCotizacionRequestBase {
	tipo: 'unidades'
	nombre_excel: string
	unidades?: UnidadAlicuotaRequest[]
}
