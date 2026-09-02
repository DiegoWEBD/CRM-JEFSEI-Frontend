import Usuario from '@/dominio/usuario/usuario'

export interface ObtenerUsuariosResponse {
	data: Usuario[]
	total: number
	pagina: number
	tamano_pagina: number
	total_paginas: number
}
