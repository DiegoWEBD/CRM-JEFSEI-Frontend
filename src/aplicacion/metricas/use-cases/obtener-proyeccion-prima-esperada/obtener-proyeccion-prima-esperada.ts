import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import type { ProyeccionPrimaEsperadaJson } from '../../dto/metricas-dashboard-json'

export const obtenerProyeccionPrimaEsperada =
	async (): Promise<ProyeccionPrimaEsperadaJson> => {
		const cookieStore = await cookies()

		const response = await axiosClient.get('/metricas/proyeccion-prima-esperada', {
			headers: { Cookie: cookieStore.toString() },
		})

		return response.data
	}
