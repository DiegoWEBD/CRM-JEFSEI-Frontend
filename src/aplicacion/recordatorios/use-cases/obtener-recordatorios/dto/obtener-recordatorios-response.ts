import Recordatorio from '@/dominio/recordatorio/recordatorio'

export interface ObtenerRecordatoriosResponse {
	data: Recordatorio[]
	total: number
	pagina: number
	tamano_pagina: number
	total_paginas: number
}
