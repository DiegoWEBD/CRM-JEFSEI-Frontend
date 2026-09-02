import { ObtenerProductosResponse } from '@/aplicacion/producto/dtos/obtener-productos-response'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useProductos = (
	initialData: ObtenerProductosResponse,
	idLineaNegocio: number | null,
	textoBusqueda: string,
	pagina: number,
	tamanoPagina: number,
) => {
	const esConsultaInicial =
		idLineaNegocio === null &&
		textoBusqueda === '' &&
		pagina === 1 &&
		tamanoPagina === 20

	return useQuery({
		queryKey: [
			'productos',
			idLineaNegocio,
			textoBusqueda,
			pagina,
			tamanoPagina,
		],
		queryFn: async () => {
			const params = new URLSearchParams()
			if (idLineaNegocio) params.set('id_linea_negocio', String(idLineaNegocio))
			if (textoBusqueda) params.set('texto_busqueda', textoBusqueda)
			params.set('pagina', String(pagina))
			params.set('tamano_pagina', String(tamanoPagina))
			const response = await axios.get(`/api/productos?${params.toString()}`)
			return response.data as ObtenerProductosResponse
		},
		initialData: esConsultaInicial ? initialData : undefined,
		placeholderData: keepPreviousData,
	})
}
