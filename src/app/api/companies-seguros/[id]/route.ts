import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: Request, { params }: Params) {
	try {
		const { id } = await params
		const body = await request.json()
		const cookieStore = await cookies()

		const response = await axiosClient.put(`/companies-seguros/${id}`, body, {
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error actualizando la compañía')
	}
}

export async function DELETE(_request: Request, { params }: Params) {
	try {
		const { id } = await params
		const cookieStore = await cookies()

		const response = await axiosClient.delete(`/companies-seguros/${id}`, {
			headers: { Cookie: cookieStore.toString() },
		})

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error eliminando la compañía')
	}
}
