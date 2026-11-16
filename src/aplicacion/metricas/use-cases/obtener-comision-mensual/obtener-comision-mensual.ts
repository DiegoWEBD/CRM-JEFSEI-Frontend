import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import type { ComisionMensualJson } from '../../dto/metricas-dashboard-json'

export const obtenerComisionMensual = async (
	mes?: number,
	year?: number,
): Promise<ComisionMensualJson> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get('/metricas/comision-mensual', {
		headers: { Cookie: cookieStore.toString() },
		params: {
			...(mes !== undefined && { mes }),
			...(year !== undefined && { year }),
		},
	})

	return response.data
}
