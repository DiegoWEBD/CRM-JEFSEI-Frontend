export interface FieldsFormularioRegistrarPoliza {
	numero_poliza: string
	id_company: number
	tipo: 'nueva' | 'renovacion'
	prima_neta: number
	comision_corredora_pct: number
	fecha_emision: string
	inicio_vigencia: string
	fin_vigencia: string
}
