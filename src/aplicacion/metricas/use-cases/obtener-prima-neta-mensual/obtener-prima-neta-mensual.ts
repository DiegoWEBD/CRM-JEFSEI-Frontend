import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import type { PrimaNetaMensualJson } from '../../dto/metricas-dashboard-json'

export const obtenerPrimaNetaMensual = async (
	mes?: number,
	year?: number,
): Promise<PrimaNetaMensualJson> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get('/metricas/prima-neta-mensual', {
		headers: { Cookie: cookieStore.toString() },
		params: {
			...(mes !== undefined && { mes }),
			...(year !== undefined && { year }),
		},
	})

	return response.data
}
