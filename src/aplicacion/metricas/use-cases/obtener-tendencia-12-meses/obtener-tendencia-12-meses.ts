import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import type { Tendencia12MesesJson } from '../../dto/metricas-dashboard-json'

export const obtenerTendencia12Meses = async (
	mes?: number,
	year?: number,
): Promise<Tendencia12MesesJson> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get('/metricas/tendencia-12-meses', {
		headers: { Cookie: cookieStore.toString() },
		params: {
			...(mes !== undefined && { mes }),
			...(year !== undefined && { year }),
		},
	})

	return response.data
}
