import { Prioridad } from '@/types/prioridad/prioridad'
import Cotizacion from '../cotizacion/cotizacion'

export default class SolicitudCotizacion {
	constructor(
		public id: number,
		public fecha: string,
		public prioridad: Prioridad,
		public cotizaciones: Cotizacion[],
		public observaciones?: string,
		public revisado: boolean = false,
	) {}
}
