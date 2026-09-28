import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerContadorNoLeidasResponse } from '@/types/notificaciones/notificacion'

export const obtenerContadorNoLeidas =
	async (): Promise<ObtenerContadorNoLeidasResponse> => {
		const cookieStore = await cookies()

		const response = await axiosClient.get('/notificaciones/contador', {
			headers: { Cookie: cookieStore.toString() },
		})

		return response.data
	}
