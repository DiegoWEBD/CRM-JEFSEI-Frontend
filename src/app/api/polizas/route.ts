import { obtenerPolizas } from '@/aplicacion/polizas/use_cases/obtener_polizas/obtener_polizas'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)

		const idCliente = searchParams.get('id_cliente')

		if (!idCliente) {
			return NextResponse.json({ error: 'Indique id_cliente' }, { status: 400 })
		}

		const polizas = await obtenerPolizas(Number(idCliente))

		return NextResponse.json(polizas)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{ error: error.response?.data?.error || error.response?.data?.detail || error.message },
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error obteniendo polizas' },
			{ status: 500 },
		)
	}
}
