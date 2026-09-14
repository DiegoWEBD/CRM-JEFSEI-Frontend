import { obtenerPoliza } from '@/aplicacion/polizas/use_cases/obtener_poliza/obtener_poliza'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ numeroPoliza: string }> },
) {
	try {
		const { numeroPoliza } = await params

		const data = await obtenerPoliza(numeroPoliza)

		return NextResponse.json(data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo póliza')
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ numeroPoliza: string }> },
) {
	try {
		const { numeroPoliza } = await params
		const body = await request.json()
		const cookieStore = await cookies()

		const response = await axiosClient.put(`/polizas/${numeroPoliza}`, body, {
			headers: {
				Cookie: cookieStore.toString(),
			},
		})

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error actualizando póliza')
	}
}
