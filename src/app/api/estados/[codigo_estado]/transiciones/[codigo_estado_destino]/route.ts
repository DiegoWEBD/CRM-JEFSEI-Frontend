import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

type Contexto = {
	params: Promise<{
		codigo_estado: string
		codigo_estado_destino: string
	}>
}

export async function PUT(request: Request, { params }: Contexto) {
	try {
		const { codigo_estado: codigoEstado, codigo_estado_destino: codigoDestino } =
			await params
		const body = await request.json()
		const cookieStore = await cookies()

		const response = await axiosClient.put(
			`/estados/${encodeURIComponent(codigoEstado)}/transiciones/${encodeURIComponent(codigoDestino)}`,
			body,
			{ headers: { Cookie: cookieStore.toString() } },
		)

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error actualizando la transición')
	}
}

export async function DELETE(
	_request: Request,
	{ params }: Contexto,
) {
	try {
		const { codigo_estado: codigoEstado, codigo_estado_destino: codigoDestino } =
			await params
		const cookieStore = await cookies()

		const response = await axiosClient.delete(
			`/estados/${encodeURIComponent(codigoEstado)}/transiciones/${encodeURIComponent(codigoDestino)}`,
			{ headers: { Cookie: cookieStore.toString() } },
		)

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error eliminando la transición')
	}
}
