import AdministradorCondominio from '@/dominio/administrador-condominio/administrador-condominio'

export interface ObtenerAdministradoresResponse {
	data: AdministradorCondominio[]
	total: number
	pagina: number
	tamano_pagina: number
	total_paginas: number
}
