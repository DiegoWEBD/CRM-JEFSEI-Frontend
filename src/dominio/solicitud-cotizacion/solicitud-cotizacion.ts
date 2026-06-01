import Cotizacion from '../cotizacion/cotizacion'

export default class SolicitudCotizacion {
	constructor(
		public id: number,
		public fecha: string,
		public prioridad: string,
		public cotizaciones: Cotizacion[],
	) {}
}
