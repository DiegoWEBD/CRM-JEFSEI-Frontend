import type { ObtenerAdministradoresResponse } from '@/aplicacion/administradores/use-cases/obtener-administradores/dto/obtener-administradores-response'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'

const TAMANO_PAGINA = 20

export const useAdministradoresInfinite = (textoBusqueda: string) => {
	return useInfiniteQuery({
		queryKey: ['administradores-infinite', textoBusqueda],
		queryFn: async ({ pageParam }) => {
			const params = new URLSearchParams()
			if (textoBusqueda.trim()) {
				params.set('texto_busqueda', textoBusqueda)
			}
			params.set('pagina', String(pageParam))
			params.set('tamano_pagina', String(TAMANO_PAGINA))
			const response = await axios.get(
				`/api/administradores?${params.toString()}`,
			)
			return response.data as ObtenerAdministradoresResponse
		},
		getNextPageParam: lastPage => {
			if (lastPage.pagina >= lastPage.total_paginas) return undefined
			return lastPage.pagina + 1
		},
		initialPageParam: 1,
		enabled: textoBusqueda.trim().length > 0,
	})
}
