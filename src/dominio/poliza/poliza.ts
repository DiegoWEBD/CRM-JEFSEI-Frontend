export default class Poliza {
	constructor(
		public numero_poliza: string,
		public tipo: string,
		public prima_neta: number,
		public comision_corredora_pct: number,
		public fecha_emision: string,
		public inicio_vigencia?: string,
		public fin_vigencia?: string,
		public company?: string,
	) {}
}
