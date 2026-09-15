export default class Cotizacion {
	constructor(
		public id: number,
		public monto_total_asegurado: number,
		public tasa_afecta: number,
		public tasa_excenta: number,
		public tasa_politica: number,
		public asistencia_afecta: number,
		public asistencia_excenta: number,
		public company: string,
		public fecha_emision: string,
		public fecha_vencimiento: string,
		public prima_afecta: number,
		public prima_excenta: number,
		public prima_neta: number,
		public prima_iva: number,
		public prima_bruta: number,
		public nombre_archivo?: string,
		public archivo_base64?: string,
	) {}
}
