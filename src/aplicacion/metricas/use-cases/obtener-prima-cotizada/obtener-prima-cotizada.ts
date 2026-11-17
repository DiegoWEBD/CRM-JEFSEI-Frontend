import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import type { PrimaCotizadaJson } from '../../dto/metricas-dashboard-json'

export const obtenerPrimaCotizada = async (): Promise<PrimaCotizadaJson> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get('/metricas/prima-cotizada', {
		headers: { Cookie: cookieStore.toString() },
	})

	return response.data
}
