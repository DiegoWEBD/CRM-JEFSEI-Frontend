import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import type { PrimaPotencialEstimadaJson } from '../../dto/metricas-dashboard-json'

export const obtenerPrimaPotencialEstimada =
	async (): Promise<PrimaPotencialEstimadaJson> => {
		const cookieStore = await cookies()

		const response = await axiosClient.get('/metricas/prima-potencial-estimada', {
			headers: { Cookie: cookieStore.toString() },
		})

		return response.data
	}
