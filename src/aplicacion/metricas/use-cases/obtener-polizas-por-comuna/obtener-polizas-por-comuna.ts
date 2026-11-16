import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import type { PolizasPorComunaJson } from '../../dto/metricas-dashboard-json'

export const obtenerPolizasPorComuna = async (
	mes?: number,
	year?: number,
): Promise<PolizasPorComunaJson> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get('/metricas/polizas-por-comuna', {
		headers: { Cookie: cookieStore.toString() },
		params: {
			...(mes !== undefined && { mes }),
			...(year !== undefined && { year }),
		},
	})

	return response.data
}
