import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import type { PrimaPorRamoJson } from '../../dto/metricas-dashboard-json'

export const obtenerPrimaPorRamo = async (
	mes?: number,
	year?: number,
): Promise<PrimaPorRamoJson> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get('/metricas/prima-por-ramo', {
		headers: { Cookie: cookieStore.toString() },
		params: {
			...(mes !== undefined && { mes }),
			...(year !== undefined && { year }),
		},
	})

	return response.data
}
