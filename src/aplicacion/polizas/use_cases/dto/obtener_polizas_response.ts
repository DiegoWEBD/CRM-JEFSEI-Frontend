import Poliza from '@/dominio/poliza/poliza'

export interface KpisPoliza {
	total_polizas: number
	vigentes: number
	por_vencer: number
	vencidas: number
	canceladas: number
	registradas: number
	prima_neta_total: number
	prima_vigente: number
	comision_total: number
}

export interface PanelPolizasResponse {
	polizas: Poliza[]
	total: number
	pagina: number
	total_paginas: number
	kpis: KpisPoliza
}
