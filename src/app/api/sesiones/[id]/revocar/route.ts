import { revocarSesion } from '@/aplicacion/sesiones/use-cases/revocar-sesion'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function PATCH(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params
		await revocarSesion(id)
		return NextResponse.json({ message: 'Sesión revocada exitosamente' })
	} catch (error) {
		return normalizarErrorServidor(error, 'Error revocando sesión')
	}
}