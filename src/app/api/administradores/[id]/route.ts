import { obtenerAdministradorPorId } from '@/aplicacion/administradores/use-cases/obtener-administrador-por-id/obtener-administrador-por-id'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params

	try {
		const administrador = await obtenerAdministradorPorId(Number(id))
		return NextResponse.json(administrador)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo administrador')
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params

	try {
		const cookieStore = await cookies()
		const body = await request.json()

		const response = await axiosClient.put(
			`/administradores/${id}`,
			body,
			{ headers: { Cookie: cookieStore.toString() } },
		)

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error actualizando administrador')
	}
}
