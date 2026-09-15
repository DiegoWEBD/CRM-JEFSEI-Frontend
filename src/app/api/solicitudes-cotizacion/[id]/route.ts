import { obtenerDetalleSolicitudCotizacion } from '@/aplicacion/solicitudes-cotizacion/use-cases/obtener-detalle-solicitud-cotizacion/obtener-detalle-solicitud-cotizacion'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
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
