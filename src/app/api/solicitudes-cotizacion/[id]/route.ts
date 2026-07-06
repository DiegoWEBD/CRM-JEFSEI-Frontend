import { obtenerDetalleSolicitudCotizacion } from '@/aplicacion/solicitudes-cotizacion/use-cases/obtener-detalle-solicitud-cotizacion/obtener-detalle-solicitud-cotizacion'
import axios from 'axios'
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
			{ error: 'Error obteniendo detalle de solicitud' },
			{ status: 500 },
		)
	}
}
