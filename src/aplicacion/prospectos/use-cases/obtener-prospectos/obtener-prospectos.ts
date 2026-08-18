import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerProspectosResponse } from './dto/obtener-prospectos-response'

export type ObtenerProspectosParams = {
	filtro?: string | null
	textoBusqueda?: string | null
	pagina?: number
	tamanoPagina?: number
}

export const obtenerProspectos = async (
	params?: ObtenerProspectosParams,
): Promise<ObtenerProspectosResponse> => {
	const cookieStore = await cookies()

	const searchParams = new URLSearchParams()
	if (params?.filtro) searchParams.set('filtro', params.filtro)
	if (params?.textoBusqueda) searchParams.set('texto_busqueda', params.textoBusqueda)
	if (params?.pagina) searchParams.set('pagina', String(params.pagina))
	if (params?.tamanoPagina) searchParams.set('tamano_pagina', String(params.tamanoPagina))

	const queryString = searchParams.toString()
	const url = queryString ? `/prospectos?${queryString}` : '/prospectos'

	const response = await axiosClient.get(url, {
		headers: { Cookie: cookieStore.toString() },
	})

	return response.data as ObtenerProspectosResponse
}
