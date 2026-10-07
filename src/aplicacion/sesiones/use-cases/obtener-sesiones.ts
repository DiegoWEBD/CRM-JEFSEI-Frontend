import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerSesionesResponse } from '../dtos/obtener-sesiones-response'

export type ObtenerSesionesParams = {
	textoBusqueda?: string | null
	rutUsuario?: string | null
	estado?: string | null
	pagina?: number
	tamanoPagina?: number
}

export const obtenerSesiones = async (
	params?: ObtenerSesionesParams,
): Promise<ObtenerSesionesResponse> => {
	const cookieStore = await cookies()

	const searchParams = new URLSearchParams()
	if (params?.textoBusqueda) searchParams.set('texto_busqueda', params.textoBusqueda)
	if (params?.rutUsuario) searchParams.set('rut_usuario', params.rutUsuario)
	if (params?.estado) searchParams.set('estado', params.estado)
	if (params?.pagina) searchParams.set('pagina', String(params.pagina))
	if (params?.tamanoPagina) searchParams.set('tamano_pagina', String(params.tamanoPagina))

	const queryString = searchParams.toString()
	const url = queryString ? `/sesiones?${queryString}` : '/sesiones'

	const response = await axiosClient.get(url, {
		headers: { Cookie: cookieStore.toString() },
	})

	return response.data as ObtenerSesionesResponse
}