import { marcarNotificacionLeida } from '@/aplicacion/notificaciones/use-cases/marcar-notificacion-leida/marcar-notificacion-leida'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

type Props = {
	params: Promise<{ id: string }>
}

export async function PATCH(_request: Request, props: Props) {
	const { id } = await props.params

	try {
		const resultado = await marcarNotificacionLeida(Number(id))

		return NextResponse.json(resultado)
	} catch (error) {
		return normalizarErrorServidor(
			error,
			'Error marcando notificación como leída',
		)
	}
}
