import { obtenerComunicadosGerencia } from '@/aplicacion/comunicados-gerencia/obtener-comunicados-gerencia/obtener-comunicados-gerencia'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const cookieStore = await cookies()

		const comunicados = await obtenerComunicadosGerencia(cookieStore.toString())

		return NextResponse.json(comunicados)
	} catch {
		return NextResponse.json(
			{ error: 'Error obteniendo comunicados' },
			{ status: 500 },
		)
	}
}
