import { revocarTodasSesionesUsuario } from '@/aplicacion/sesiones/use-cases/revocar-todas-sesiones-usuario'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function PATCH(
	_request: Request,
	{ params }: { params: Promise<{ rut: string }> },
) {
	try {
		const { rut } = await params
		await revocarTodasSesionesUsuario(rut)
		return NextResponse.json({
			message: 'Todas las sesiones del usuario han sido revocadas',
		})
	} catch (error) {
		return normalizarErrorServidor(error, 'Error revocando sesiones del usuario')
	}
}