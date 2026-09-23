import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { MarcarLeidaResponse } from '@/types/notificaciones/notificacion'

export const marcarNotificacionLeida = async (
	id: number,
): Promise<MarcarLeidaResponse> => {
	const cookieStore = await cookies()

	const response = await axiosClient.patch(`/notificaciones/${id}/leer`, null, {
		headers: { Cookie: cookieStore.toString() },
	})

	return response.data
}
