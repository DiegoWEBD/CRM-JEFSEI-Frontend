import { ObtenerAdministradoresResponse } from '@/aplicacion/administradores/use-cases/obtener-administradores/dto/obtener-administradores-response'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useAdministradores = (
	initialData: ObtenerAdministradoresResponse,
	textoBusqueda: string,
	pagina: number,
	tamanoPagina: number,
) => {
	const esConsultaInicial =
		textoBusqueda === '' && pagina === 1 && tamanoPagina === 10

	return useQuery({
		queryKey: ['administradores', textoBusqueda, pagina, tamanoPagina],
		queryFn: async () => {
			const params = new URLSearchParams()
			if (textoBusqueda) params.set('texto_busqueda', textoBusqueda)
			params.set('pagina', String(pagina))
			params.set('tamano_pagina', String(tamanoPagina))
			const response = await axios.get(
				`/api/administradores?${params.toString()}`,
			)
			return response.data as ObtenerAdministradoresResponse
		},
		...(esConsultaInicial ? { initialData } : {}),
		placeholderData: keepPreviousData,
	})
}
