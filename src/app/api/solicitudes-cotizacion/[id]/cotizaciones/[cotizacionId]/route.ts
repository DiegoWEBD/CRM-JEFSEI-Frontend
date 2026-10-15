import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string; cotizacionId: string }> },
) {
	try {
		const { id, cotizacionId } = await params
		const formData = await request.formData()
		const cookieStore = await cookies()

		const response = await axiosClient.put(
			`/solicitudes-cotizacion/${id}/cotizaciones/${cotizacionId}`,
			formData,
			{
				headers: {
					Cookie: cookieStore.toString(),
				},
			},
		)

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error actualizando cotización')
	}
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ id: string; cotizacionId: string }> },
) {
	try {
		const { id, cotizacionId } = await params
		const cookieStore = await cookies()

		const response = await axiosClient.delete(
			`/solicitudes-cotizacion/${id}/cotizaciones/${cotizacionId}`,
			{
				headers: {
					Cookie: cookieStore.toString(),
				},
			},
		)

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error eliminando cotización')
	}
}