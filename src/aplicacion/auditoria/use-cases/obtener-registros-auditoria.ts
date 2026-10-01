import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerRegistrosAuditoriaResponse } from '../dtos/obtener-registros-auditoria-response'

export type ObtenerRegistrosAuditoriaParams = {
	textoBusqueda?: string | null
	categoria?: string | null
	evento?: string | null
	rutUsuario?: string | null
	ipOrigen?: string | null
	entidadTipo?: string | null
	fechaDesde?: string | null
	fechaHasta?: string | null
	pagina?: number
	tamanoPagina?: number
}

export const obtenerRegistrosAuditoria = async (
	params?: ObtenerRegistrosAuditoriaParams,
): Promise<ObtenerRegistrosAuditoriaResponse> => {
	const cookieStore = await cookies()

	const searchParams = new URLSearchParams()
	if (params?.textoBusqueda) searchParams.set('texto_busqueda', params.textoBusqueda)
	if (params?.categoria) searchParams.set('categoria', params.categoria)
	if (params?.evento) searchParams.set('evento', params.evento)
	if (params?.rutUsuario) searchParams.set('rut_usuario', params.rutUsuario)
	if (params?.ipOrigen) searchParams.set('ip_origen', params.ipOrigen)
	if (params?.entidadTipo) searchParams.set('entidad_tipo', params.entidadTipo)
	if (params?.fechaDesde) searchParams.set('fecha_desde', params.fechaDesde)
	if (params?.fechaHasta) searchParams.set('fecha_hasta', params.fechaHasta)
	if (params?.pagina) searchParams.set('pagina', String(params.pagina))
	if (params?.tamanoPagina) searchParams.set('tamano_pagina', String(params.tamanoPagina))

	const queryString = searchParams.toString()
	const url = queryString ? `/auditoria?${queryString}` : '/auditoria'

	const response = await axiosClient.get(url, {
		headers: { Cookie: cookieStore.toString() },
	})

	return response.data as ObtenerRegistrosAuditoriaResponse
}
