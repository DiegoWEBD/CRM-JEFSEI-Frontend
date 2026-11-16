import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import type { PrimaPorCompaniaJson } from '../../dto/metricas-dashboard-json'

export const obtenerPrimaPorCompania = async (
	mes?: number,
	year?: number,
): Promise<PrimaPorCompaniaJson> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get('/metricas/prima-por-compania', {
		headers: { Cookie: cookieStore.toString() },
		params: {
			...(mes !== undefined && { mes }),
			...(year !== undefined && { year }),
		},
	})

	return response.data
}
