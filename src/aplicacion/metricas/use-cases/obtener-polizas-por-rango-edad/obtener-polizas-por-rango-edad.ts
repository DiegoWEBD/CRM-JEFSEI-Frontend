import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import type { PolizasPorRangoEdadJson } from '../../dto/metricas-dashboard-json'

export const obtenerPolizasPorRangoEdad = async (
	mes?: number,
	year?: number,
): Promise<PolizasPorRangoEdadJson> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get('/metricas/polizas-por-rango-edad', {
		headers: { Cookie: cookieStore.toString() },
		params: {
			...(mes !== undefined && { mes }),
			...(year !== undefined && { year }),
		},
	})

	return response.data
}
