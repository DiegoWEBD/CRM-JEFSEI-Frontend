import { obtenerContactos } from '@/aplicacion/contactos/use-cases/obtener-contactos/obtener-contactos'
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
		const contactos = await obtenerContactos(Number(id))
		return NextResponse.json({ data: contactos })
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo contactos')
	}
}

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params

	try {
		const body = await request.json()
		const cookieStore = await cookies()

		const response = await axiosClient.post(
			`/prospectos/${id}/contactos`,
			body,
			{ headers: { Cookie: cookieStore.toString() } },
		)

		return NextResponse.json(response.data, { status: 201 })
	} catch (error) {
		return normalizarErrorServidor(error, 'Error creando contacto')
	}
}