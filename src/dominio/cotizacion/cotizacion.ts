export default class Cotizacion {
	constructor(
		public id: number,
		public monto_total_asegurado: number,
		public tasa_afecta: number,
		public tasa_excenta: number,
		public tasa_politica: number,
		public prima_adicional_asistencia: number,
		public company: string,
		public fecha_emision: string,
		public fecha_vencimiento: string,
	) {}
}
