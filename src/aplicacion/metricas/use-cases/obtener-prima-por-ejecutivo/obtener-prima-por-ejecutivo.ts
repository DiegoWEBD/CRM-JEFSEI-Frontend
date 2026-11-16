import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import type { PrimaPorEjecutivoJson } from '../../dto/metricas-dashboard-json'

export const obtenerPrimaPorEjecutivo = async (
	mes?: number,
	year?: number,
): Promise<PrimaPorEjecutivoJson> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get('/metricas/prima-por-ejecutivo', {
		headers: { Cookie: cookieStore.toString() },
		params: {
			...(mes !== undefined && { mes }),
			...(year !== undefined && { year }),
		},
	})

	return response.data
}
