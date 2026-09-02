import Producto from '@/dominio/producto/producto'

export interface ObtenerProductosResponse {
	data: Producto[]
	total: number
	pagina: number
	total_paginas: number
}
