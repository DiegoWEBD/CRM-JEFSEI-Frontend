import Sesion from '@/dominio/sesion/sesion'

export interface ObtenerSesionesResponse {
	data: Sesion[]
	total: number
	pagina: number
	tamano_pagina: number
	total_paginas: number
}