import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import type { PrimaEsperadaJson } from '../../dto/metricas-dashboard-json'

export const obtenerPrimaEsperada = async (): Promise<PrimaEsperadaJson> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get('/metricas/prima-esperada', {
		headers: { Cookie: cookieStore.toString() },
	})

	return response.data
}
