import { ObtenerCompaniesSegurosResponse } from '@/aplicacion/companies-seguros/dto/obtener-companies-seguros-response'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'

type UseCompaniesSegurosPaginadoParams = {
	initialData: ObtenerCompaniesSegurosResponse
	textoBusqueda: string
	pagina: number
	tamanoPagina: number
}

/**
 * Listado paginado del panel de administración de compañías.
 *
 * La queryKey debe calzar exactamente con el prefetch del servidor
 * (`page.tsx`): mismo orden, mismos tipos y mismos valores
 * (`''` no `undefined`, `1` no `'1'`, `10` no `'10'`), o la hidratación
 * no se aprovecharía y se dispararía un segundo fetch.
 */
export const useCompaniesSegurosPaginado = ({
	initialData,
	textoBusqueda,
	pagina,
	tamanoPagina,
}: UseCompaniesSegurosPaginadoParams) => {
	const esConsultaInicial =
		textoBusqueda === '' && pagina === 1 && tamanoPagina === 10

	return useQuery({
		queryKey: ['companies-seguros', textoBusqueda, pagina, tamanoPagina],
		queryFn: async () => {
			const params = new URLSearchParams()
			if (textoBusqueda) params.set('texto_busqueda', textoBusqueda)
			params.set('pagina', String(pagina))
			params.set('tamano_pagina', String(tamanoPagina))

			const response = await axios.get<ObtenerCompaniesSegurosResponse>(
				`/api/companies-seguros?${params.toString()}`,
			)
			return response.data
		},
		initialData: esConsultaInicial ? initialData : undefined,
		placeholderData: keepPreviousData,
	})
}
