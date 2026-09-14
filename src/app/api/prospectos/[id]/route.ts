import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
	_: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const cookieStore = await cookies()
		const cookie = cookieStore.toString()
		const { id } = await params

		const response = await axiosClient.get(`/prospectos/${id}`, {
			headers: {
				Cookie: cookie,
			},
		})

		return NextResponse.json(response.data.prospecto)
	} catch (error) {
		return normalizarErrorServidor(
			error,
			'Error al obtener la información del prospecto',
		)
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const cookieStore = await cookies()
		const cookie = cookieStore.toString()
		const { id } = await params
		const body = await request.json()

		const response = await axiosClient.put(`/prospectos/${id}`, body, {
			headers: {
				Cookie: cookie,
			},
		})

		const data = response.data

		return NextResponse.json({ status: response.status, message: data.message })
	} catch (error) {
		return normalizarErrorServidor(
			error,
			'Error al actualizar la información del prospecto',
		)
	}
}
