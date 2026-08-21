import type { ReporteProcesoComercial } from './reporte-proceso-comercial'

export interface ObtenerReportesResponse {
	data: ReporteProcesoComercial[]
	total: number
	pagina: number
	tamano_pagina: number
	total_paginas: number
	contadores_estado: Record<string, number>
}
