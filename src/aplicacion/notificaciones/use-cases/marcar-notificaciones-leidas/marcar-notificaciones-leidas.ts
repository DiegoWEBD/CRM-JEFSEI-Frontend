import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { MarcarTodasLeidasResponse } from '@/types/notificaciones/notificacion'

export const marcarNotificacionesLeidas =
	async (): Promise<MarcarTodasLeidasResponse> => {
		const cookieStore = await cookies()

		const response = await axiosClient.post(
			'/notificaciones/leer-todas',
			null,
			{
				headers: { Cookie: cookieStore.toString() },
			},
		)

		return response.data
	}
