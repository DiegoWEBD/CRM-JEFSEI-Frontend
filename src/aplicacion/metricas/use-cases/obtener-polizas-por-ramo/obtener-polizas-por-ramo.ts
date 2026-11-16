import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import type { PolizasPorRamoJson } from '../../dto/metricas-dashboard-json'

export const obtenerPolizasPorRamo = async (
	mes?: number,
	year?: number,
): Promise<PolizasPorRamoJson> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get('/metricas/polizas-por-ramo', {
		headers: { Cookie: cookieStore.toString() },
		params: {
			...(mes !== undefined && { mes }),
			...(year !== undefined && { year }),
		},
	})

	return response.data
}
