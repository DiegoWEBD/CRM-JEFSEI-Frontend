import { TicketWebSocketResponse } from '@/types/notificaciones/notificacion'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'

/**
 * Cambia la cookie httpOnly de sesión (que el navegador no puede leer ni enviar
 * al conectar directo con el backend) por un ticket de un solo propósito que sí
 * se pasa por query string al WebSocket.
 */
export const obtenerTicketWebSocket =
	async (): Promise<TicketWebSocketResponse> => {
		const cookieStore = await cookies()

		const response = await axiosClient.post('/auth/ws-ticket', null, {
			headers: { Cookie: cookieStore.toString() },
		})

		return response.data
	}
