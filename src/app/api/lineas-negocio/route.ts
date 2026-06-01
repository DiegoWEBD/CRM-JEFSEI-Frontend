import { obtenerLineasNegocio } from '@/aplicacion/linea-negocio/use-cases/obtener-lineas-negocio'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const lineasNegocio = await obtenerLineasNegocio()

		return NextResponse.json(lineasNegocio)
	} catch {
		return NextResponse.json(
			{ error: 'Error obteniendo líneas de negocio' },
			{ status: 500 },
		)
	}
}
