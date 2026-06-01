import { HistorialEstadoJson } from '@/aplicacion/estados/dto/historial-estado-json'
import { UsuarioResumenJson } from '@/aplicacion/usuarios/dtos/usuario-resumen-json'
import SolicitudCotizacion from '../solicitud-cotizacion/solicitud-cotizacion'

export default class ProcesoComercial {
	constructor(
		public id: number,
		public historial_estados: HistorialEstadoJson[],
		public ejecutivo_comercial: UsuarioResumenJson | null,
		public ejecutivo_evaluacion: UsuarioResumenJson | null,
		public solicitudes_cotizacion: SolicitudCotizacion[],
	) {}
}
