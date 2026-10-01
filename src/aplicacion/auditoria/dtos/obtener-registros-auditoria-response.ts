import RegistroAuditoria from '@/dominio/registro-auditoria/registro-auditoria'

export interface ObtenerRegistrosAuditoriaResponse {
	data: RegistroAuditoria[]
	total: number
	pagina: number
	tamano_pagina: number
	total_paginas: number
}
