import type { PanelEstudioFila } from './panel-estudio-fila'

export interface ContadoresPanelCotizaciones {
	cotizaciones_vigentes: number
	cotizaciones_por_vencer: number
	cotizaciones_vencidas: number
	estudios_pendientes: number
	estudios_emitidos: number
}

export interface ObtenerPanelEstudiosResponse {
	data: PanelEstudioFila[]
	/** Se calculan antes de aplicar cualquier filtro (solo scope por permisos). */
	contadores: ContadoresPanelCotizaciones
	total: number
	pagina: number
	tamano_pagina: number
	total_paginas: number
}
