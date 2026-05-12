export default class ProspectoResumenJson {
	constructor(
		public id: number,
		public nombre_riesgo: string,
		public nombre_contacto: string,
		public linea_negocio: string,
		public estado: string,
		public fecha_ultima_accion: string,
		public proxima_accion: string | null,
	) {}
}
