import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params

	try {
		const body = await request.json()
		const cookieStore = await cookies()

		const response = await axiosClient.put(`/contactos/${id}`, body, {
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error actualizando contacto')
	}
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params

	try {
		const cookieStore = await cookies()

		const response = await axiosClient.delete(`/contactos/${id}`, {
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error eliminando contacto')
	}
}