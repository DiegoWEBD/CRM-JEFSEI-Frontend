import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerAdministradoresResponse } from './dto/obtener-administradores-response'

export type ObtenerAdministradoresParams = {
	textoBusqueda?: string | null
	pagina?: number
	tamanoPagina?: number
}

export const obtenerAdministradores = async (
	params?: ObtenerAdministradoresParams,
): Promise<ObtenerAdministradoresResponse> => {
	const cookieStore = await cookies()

	const searchParams = new URLSearchParams()
	if (params?.textoBusqueda) searchParams.set('texto_busqueda', params.textoBusqueda)
	if (params?.pagina) searchParams.set('pagina', String(params.pagina))
	if (params?.tamanoPagina) searchParams.set('tamano_pagina', String(params.tamanoPagina))

	const queryString = searchParams.toString()
	const url = queryString ? `/administradores?${queryString}` : '/administradores'

	const response = await axiosClient.get(url, {
		headers: { Cookie: cookieStore.toString() },
	})

	return response.data as ObtenerAdministradoresResponse
}
