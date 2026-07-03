import { EstadoPoliza } from '@/lib/estados-cotizaciones'

export default class Poliza {
	constructor(
		public numero_poliza: string,
		public id_proceso_comercial: number,
		public tipo: string,
		public nombre_producto: string,
		public prima_neta: number,
		public comision_corredora_pct: number,
		public fecha_emision: string,
		public estado: EstadoPoliza,
		public renovacion_cotizada: boolean,
		public inicio_vigencia?: string,
		public fin_vigencia?: string,
		public company?: { id: number; nombre: string } | null,
	) {}
}
