import { obtenerTicketWebSocket } from '@/aplicacion/notificaciones/use-cases/obtener-ticket-websocket/obtener-ticket-websocket'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function POST() {
	try {
		const resultado = await obtenerTicketWebSocket()

		return NextResponse.json(resultado)
	} catch (error) {
		return normalizarErrorServidor(
			error,
			'Error obteniendo el ticket del WebSocket',
		)
	}
}
