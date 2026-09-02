import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerProductosResponse } from '../dtos/obtener-productos-response'

export type ObtenerProductosParams = {
	idLineaNegocio?: number | null
	textoBusqueda?: string | null
	pagina?: number
	tamanoPagina?: number
}

export const obtenerProductos = async (
	params?: ObtenerProductosParams,
): Promise<ObtenerProductosResponse> => {
	const cookieStore = await cookies()

	const searchParams = new URLSearchParams()
	if (params?.idLineaNegocio)
		searchParams.set('id_linea_negocio', String(params.idLineaNegocio))
	if (params?.textoBusqueda)
		searchParams.set('texto_busqueda', params.textoBusqueda)
	if (params?.pagina) searchParams.set('pagina', String(params.pagina))
	if (params?.tamanoPagina)
		searchParams.set('tamano_pagina', String(params.tamanoPagina))

	const queryString = searchParams.toString()
	const url = queryString ? `/productos?${queryString}` : '/productos'

	const response = await axiosClient.get(url, {
		headers: { Cookie: cookieStore.toString() },
	})

	return response.data as ObtenerProductosResponse
}
