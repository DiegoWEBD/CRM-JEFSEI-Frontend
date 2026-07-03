import { obtenerPoliza } from '@/aplicacion/polizas/use_cases/obtener_poliza/obtener_poliza'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ numeroPoliza: string }> },
) {
	try {
		const { numeroPoliza } = await params

		const data = await obtenerPoliza(numeroPoliza)

		return NextResponse.json(data)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{ error: error.response?.data?.error || error.response?.data?.detail || error.message },
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error obteniendo póliza' },
			{ status: 500 },
		)
	}
}
