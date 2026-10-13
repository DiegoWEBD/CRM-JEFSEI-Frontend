import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ codigo_estado: string }> },
) {
	try {
		const { codigo_estado: codigoEstado } = await params
		const cookieStore = await cookies()

		const response = await axiosClient.get(
			`/estados/${encodeURIComponent(codigoEstado)}/transiciones`,
			{ headers: { Cookie: cookieStore.toString() } },
		)

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo las transiciones')
	}
}

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ codigo_estado: string }> },
) {
	try {
		const { codigo_estado: codigoEstado } = await params
		const body = await request.json()
		const cookieStore = await cookies()

		const response = await axiosClient.post(
			`/estados/${encodeURIComponent(codigoEstado)}/transiciones`,
			body,
			{ headers: { Cookie: cookieStore.toString() } },
		)

		return NextResponse.json(response.data, { status: 201 })
	} catch (error) {
		return normalizarErrorServidor(error, 'Error registrando la transición')
	}
}
