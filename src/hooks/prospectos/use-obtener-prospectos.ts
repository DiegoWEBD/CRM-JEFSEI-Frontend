import { ObtenerProspectosResponse } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/obtener-prospectos-response'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useObtenerProspectos = (
	initialData: ObtenerProspectosResponse,
	filtro: string | null,
	textoBusqueda: string,
	pagina: number,
	tamanoPagina: number,
) => {
	const esConsultaInicial =
		filtro === null &&
		textoBusqueda === '' &&
		pagina === 1 &&
		tamanoPagina === 10

	return useQuery({
		queryKey: ['prospectos', filtro, textoBusqueda, pagina, tamanoPagina],
		queryFn: async () => {
			const params = new URLSearchParams()
			if (filtro) params.set('filtro', filtro)
			if (textoBusqueda) params.set('texto_busqueda', textoBusqueda)
			params.set('pagina', String(pagina))
			params.set('tamano_pagina', String(tamanoPagina))
			const response = await axios.get(`/api/prospectos?${params.toString()}`)
			return response.data as ObtenerProspectosResponse
		},
		...(esConsultaInicial ? { initialData } : {}),
		placeholderData: keepPreviousData,
	})
}
