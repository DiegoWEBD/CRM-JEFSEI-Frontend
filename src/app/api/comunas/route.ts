import { obtenerComunas } from '@/aplicacion/comunas/use-cases/obtener-comunas'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const comunas = await obtenerComunas()

		return NextResponse.json(comunas)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{ error: error.response?.data?.error || error.response?.data?.detail || error.message },
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error obteniendo comunas' },
			{ status: 500 },
		)
	}
}
