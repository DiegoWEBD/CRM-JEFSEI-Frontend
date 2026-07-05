import { obtenerAdministradorPorId } from '@/aplicacion/administradores/use-cases/obtener-administrador-por-id/obtener-administrador-por-id'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import axios from 'axios'
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
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{
					error:
						error.response?.data?.error ||
						error.response?.data?.detail ||
						error.message,
				},
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error obteniendo administrador' },
			{ status: 500 },
		)
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
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{
					error:
						error.response?.data?.error ||
						error.response?.data?.detail ||
						error.message,
				},
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error actualizando administrador' },
			{ status: 500 },
		)
	}
}
