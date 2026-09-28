import { ObtenerCompaniesSegurosResponse } from '@/aplicacion/companies-seguros/dto/obtener-companies-seguros-response'
import CompanySeguro from '@/dominio/company-seguro/company-seguro'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type UseCompaniesSegurosParams = {
	enabled?: boolean
}

/**
 * Select de compañías para pólizas/cotizaciones.
 *
 * El backend pagina el listado, así que se pide la primera página con
 * `tamano_pagina=100` (el dataset es acotado) y se devuelve solo `data`
 * para mantener la firma original: `CompanySeguro[]`.
 *
 * La queryKey sigue siendo `['companies-seguros']` (prefijo), de modo que
 * `invalidateQueries({ queryKey: ['companies-seguros'] })` refresca este
 * select y el paginado del panel al mismo tiempo.
 */
export const useCompaniesSeguros = ({ enabled }: UseCompaniesSegurosParams) => {
	return useQuery<CompanySeguro[]>({
		queryKey: ['companies-seguros'],
		queryFn: async () => {
			const params = new URLSearchParams()
			params.set('pagina', '1')
			params.set('tamano_pagina', '100')

			const response = await axios.get<ObtenerCompaniesSegurosResponse>(
				`/api/companies-seguros?${params.toString()}`,
			)
			return response.data.data
		},
		enabled: enabled ?? true,
	})
}
