import { obtenerComunas } from '@/aplicacion/comunas/use-cases/obtener-comunas'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const comunas = await obtenerComunas()

		return NextResponse.json(comunas)
	} catch {
		return NextResponse.json(
			{ error: 'Error obteniendo comunas' },
			{ status: 500 },
		)
	}
}
