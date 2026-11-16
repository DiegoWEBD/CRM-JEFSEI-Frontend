import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import type { ActividadesPorTipoJson } from '../../dto/metricas-dashboard-json'

export const obtenerActividadesPorTipo = async (
	mes?: number,
	year?: number,
): Promise<ActividadesPorTipoJson> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get('/metricas/actividades-por-tipo', {
		headers: { Cookie: cookieStore.toString() },
		params: {
			...(mes !== undefined && { mes }),
			...(year !== undefined && { year }),
		},
	})

	return response.data
}
