export interface ActualizarPolizaRequest {
	tipo: string
	prima_neta: number
	comision_corredora_pct: number
	fecha_emision: string | null
	inicio_vigencia: string | null
	fin_vigencia: string | null
	id_company: number | null
}
