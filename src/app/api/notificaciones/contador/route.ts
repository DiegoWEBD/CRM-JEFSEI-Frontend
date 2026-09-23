import { obtenerContadorNoLeidas } from '@/aplicacion/notificaciones/use-cases/obtener-contador-no-leidas/obtener-contador-no-leidas'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const resultado = await obtenerContadorNoLeidas()

		return NextResponse.json(resultado)
	} catch (error) {
		return normalizarErrorServidor(
			error,
			'Error obteniendo contador de notificaciones',
		)
	}
}
