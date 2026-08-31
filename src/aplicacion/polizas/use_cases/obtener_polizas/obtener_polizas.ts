import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { PanelPolizasResponse } from '../dto/obtener_polizas_response'

export type FiltrosPanelPolizas = {
	id_cliente?: number | null
	id_company?: number | null
	id_producto?: number | null
	id_linea_negocio?: number | null
	texto_busqueda?: string | null
	estado?: string | null
	pagina?: number
	tamano_pagina?: number
}

export const obtenerPolizas = async (
	filtros: FiltrosPanelPolizas = {},
): Promise<PanelPolizasResponse> => {
	const cookieStore = await cookies()

	const params = new URLSearchParams()

	if (filtros.id_cliente != null) params.set('id_cliente', String(filtros.id_cliente))
	if (filtros.id_company != null) params.set('id_company', String(filtros.id_company))
	if (filtros.id_producto != null) params.set('id_producto', String(filtros.id_producto))
	if (filtros.id_linea_negocio != null) params.set('id_linea_negocio', String(filtros.id_linea_negocio))
	if (filtros.texto_busqueda) params.set('texto_busqueda', filtros.texto_busqueda)
	if (filtros.estado) params.set('estado', filtros.estado)
	if (filtros.pagina) params.set('pagina', String(filtros.pagina))
	if (filtros.tamano_pagina) params.set('tamano_pagina', String(filtros.tamano_pagina))

	const qs = params.toString()
	const url = `/polizas${qs ? `?${qs}` : ''}`

	const response = await axiosClient.get(url, {
		headers: {
			Cookie: cookieStore.toString(),
		},
	})

	return response.data as PanelPolizasResponse
}
