import { obtenerProspectosPorAdministrador } from '@/aplicacion/administradores/use-cases/obtener-prospectos-por-administrador/obtener-prospectos-por-administrador'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params
		const prospectos = await obtenerProspectosPorAdministrador(Number(id))
		return NextResponse.json(prospectos)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo prospectos del administrador')
	}
}
