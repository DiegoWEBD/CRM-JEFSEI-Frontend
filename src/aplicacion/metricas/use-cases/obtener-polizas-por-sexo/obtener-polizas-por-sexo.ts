import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import type { PolizasPorSexoJson } from '../../dto/metricas-dashboard-json'

export const obtenerPolizasPorSexo = async (
	mes?: number,
	year?: number,
): Promise<PolizasPorSexoJson> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get('/metricas/polizas-por-sexo', {
		headers: { Cookie: cookieStore.toString() },
		params: {
			...(mes !== undefined && { mes }),
			...(year !== undefined && { year }),
		},
	})

	return response.data
}
