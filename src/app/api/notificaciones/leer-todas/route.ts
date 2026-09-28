import { marcarNotificacionesLeidas } from '@/aplicacion/notificaciones/use-cases/marcar-notificaciones-leidas/marcar-notificaciones-leidas'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function POST() {
	try {
		const resultado = await marcarNotificacionesLeidas()

		return NextResponse.json(resultado)
	} catch (error) {
		return normalizarErrorServidor(
			error,
			'Error marcando notificaciones como leídas',
		)
	}
}
