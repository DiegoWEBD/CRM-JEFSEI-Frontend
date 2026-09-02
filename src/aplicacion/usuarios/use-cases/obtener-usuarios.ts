import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerUsuariosResponse } from '../dtos/obtener-usuarios-response'

export type ObtenerUsuariosParams = {
	textoBusqueda?: string | null
	pagina?: number
	tamanoPagina?: number
}

export const obtenerUsuarios = async (
	params?: ObtenerUsuariosParams,
): Promise<ObtenerUsuariosResponse> => {
	const cookieStore = await cookies()

	const searchParams = new URLSearchParams()
	if (params?.textoBusqueda) searchParams.set('texto_busqueda', params.textoBusqueda)
	if (params?.pagina) searchParams.set('pagina', String(params.pagina))
	if (params?.tamanoPagina) searchParams.set('tamano_pagina', String(params.tamanoPagina))

	const queryString = searchParams.toString()
	const url = queryString ? `/usuarios?${queryString}` : '/usuarios'

	const response = await axiosClient.get(url, {
		headers: { Cookie: cookieStore.toString() },
	})

	return response.data as ObtenerUsuariosResponse
}
