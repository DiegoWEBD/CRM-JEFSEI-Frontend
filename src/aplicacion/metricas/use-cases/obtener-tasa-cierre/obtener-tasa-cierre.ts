import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import type { TasaCierreJson } from '../../dto/metricas-dashboard-json'

export const obtenerTasaCierre = async (): Promise<TasaCierreJson> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get('/metricas/tasa-cierre', {
		headers: { Cookie: cookieStore.toString() },
	})

	return response.data
}
