import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import type { TendenciaAnualJson } from '../../dto/metricas-dashboard-json'

export const obtenerTendenciaAnual = async (
	mes?: number,
	year?: number,
): Promise<TendenciaAnualJson> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get('/metricas/tendencia-anual', {
		headers: { Cookie: cookieStore.toString() },
		params: {
			...(mes !== undefined && { mes }),
			...(year !== undefined && { year }),
		},
	})

	return response.data
}
