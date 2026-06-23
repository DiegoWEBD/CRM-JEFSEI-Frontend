import { obtenerLineasNegocio } from '@/aplicacion/linea-negocio/use-cases/obtener-lineas-negocio'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const lineasNegocio = await obtenerLineasNegocio()

		return NextResponse.json(lineasNegocio)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{ error: error.response?.data?.error || error.response?.data?.detail || error.message },
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error obteniendo líneas de negocio' },
			{ status: 500 },
		)
	}
}
