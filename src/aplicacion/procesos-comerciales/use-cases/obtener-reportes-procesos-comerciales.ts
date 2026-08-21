import type { ObtenerReportesResponse } from '@/aplicacion/procesos-comerciales/dto/obtener-reportes-response'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'

export type ObtenerReportesParams = {
	texto_busqueda?: string | null
	ejecutivos?: string[] | null
	etapas?: string[] | null
	estado_semaforo?: string[] | null
	estado_proceso?: string | null
	cerrado?: boolean | null
	fecha_desde?: string | null
	fecha_hasta?: string | null
	pagina?: number
	tamano_pagina?: number
}

export const obtenerReportesProcesosComerciales = async (
	params?: ObtenerReportesParams,
): Promise<ObtenerReportesResponse> => {
	const cookieStore = await cookies()
	const axiosResponse = await axiosClient.post(
		'/procesos-comerciales/reportes',
		params ?? {},
		{ headers: { Cookie: cookieStore.toString() } },
	)
	return axiosResponse.data as ObtenerReportesResponse
}
