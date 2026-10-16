import { axiosClient } from '@/infraestructura/axios/axios-client'
import { obtenerDetalleSolicitudCotizacion } from '@/aplicacion/solicitudes-cotizacion/use-cases/obtener-detalle-solicitud-cotizacion/obtener-detalle-solicitud-cotizacion'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params
		const solicitud = await obtenerDetalleSolicitudCotizacion(Number(id))
		return NextResponse.json(solicitud)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo detalle de solicitud')
	}
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params
		const cookieStore = await cookies()

		const response = await axiosClient.delete(
			`/solicitudes-cotizacion/${id}`,
			{
				headers: {
					Cookie: cookieStore.toString(),
				},
			},
		)

		return NextResponse.json(response.data)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error eliminando solicitud de cotización')
	}
}
