export default class EvaluacionRiesgo {
	constructor(
		public uf_por_metro_cuadrado: number | null,
		public porcentaje_depreciacion: number | null,
		public porcentaje_espacios_comunes: number | null,
		public observaciones: string | null = null,
	) {}
}
