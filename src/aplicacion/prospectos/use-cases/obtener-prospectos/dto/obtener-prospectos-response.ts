import { ProspectoResumenJson } from './prospecto-resumen-json'

export interface ObtenerProspectosResponse {
	data: ProspectoResumenJson[]
	total: number
	pagina: number
	tamano_pagina: number
	total_paginas: number
	contadores_estado: Record<string, number>
}
