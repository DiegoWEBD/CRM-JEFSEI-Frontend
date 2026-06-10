import { Prioridad } from '@/types/prioridad/prioridad'

export default class SolicitudCotizacion {
	constructor(
		public id: number,
		public fecha: string,
		public prioridad: Prioridad,
		public tipo: string,
		public observaciones?: string,
		public revisado: boolean = false,
	) {}
}
