import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import type { ResumenActividadesJson } from '../../dto/metricas-dashboard-json'

export const obtenerResumenActividades = async (
	mes?: number,
	year?: number,
): Promise<ResumenActividadesJson> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get('/metricas/resumen-actividades', {
		headers: { Cookie: cookieStore.toString() },
		params: {
			...(mes !== undefined && { mes }),
			...(year !== undefined && { year }),
		},
	})

	return response.data
}
