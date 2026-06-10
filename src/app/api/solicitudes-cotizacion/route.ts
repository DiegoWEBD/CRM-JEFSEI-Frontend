import { obtenerSolicitudesCotizacionActivas } from '@/aplicacion/solicitudes-cotizacion/use-cases/obtener-solicitudes-cotizacion/obtener-solicitudes-cotizacion-activas'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const idProspecto = searchParams.get('id_prospecto')

		if (!idProspecto)
			return NextResponse.json(
				{ error: 'Solicitud inválida, indique id_prospecto' },
				{ status: 400 },
			)

		const solicitudes = await obtenerSolicitudesCotizacionActivas(
			Number(idProspecto),
		)

		return NextResponse.json(solicitudes)
	} catch {
		return NextResponse.json(
			{ error: 'Error obteniendo solicitudes' },
			{ status: 500 },
		)
	}
}
