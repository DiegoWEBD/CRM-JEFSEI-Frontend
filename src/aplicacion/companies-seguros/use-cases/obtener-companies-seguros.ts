import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerCompaniesSegurosResponse } from '../dto/obtener-companies-seguros-response'

export type ObtenerCompaniesSegurosParams = {
	textoBusqueda?: string | null
	pagina?: number
	tamanoPagina?: number
}

export const obtenerCompaniesSeguros = async (
	params?: ObtenerCompaniesSegurosParams,
): Promise<ObtenerCompaniesSegurosResponse> => {
	const cookieStore = await cookies()

	const searchParams = new URLSearchParams()
	if (params?.textoBusqueda)
		searchParams.set('texto_busqueda', params.textoBusqueda)
	if (params?.pagina) searchParams.set('pagina', String(params.pagina))
	if (params?.tamanoPagina)
		searchParams.set('tamano_pagina', String(params.tamanoPagina))

	const queryString = searchParams.toString()
	const url = queryString
		? `/companies-seguros?${queryString}`
		: '/companies-seguros'

	const response = await axiosClient.get(url, {
		headers: { Cookie: cookieStore.toString() },
	})

	return response.data as ObtenerCompaniesSegurosResponse
}
