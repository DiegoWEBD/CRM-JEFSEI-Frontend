import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import type { CompaniaTopJson } from '../../dto/metricas-dashboard-json'

export const obtenerCompaniaTop = async (
	mes?: number,
	year?: number,
): Promise<CompaniaTopJson> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get('/metricas/compania-top', {
		headers: { Cookie: cookieStore.toString() },
		params: {
			...(mes !== undefined && { mes }),
			...(year !== undefined && { year }),
		},
	})

	return response.data
}
