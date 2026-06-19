import type { FiltrosProcesosComerciales } from '@/aplicacion/procesos-comerciales/dto/filtros-procesos-comerciales'
import { obtenerReportesProcesosComerciales } from '@/aplicacion/procesos-comerciales/use-cases/obtener-reportes-procesos-comerciales'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const body: FiltrosProcesosComerciales = await request.json()
		const reportes = await obtenerReportesProcesosComerciales(body)
		return NextResponse.json(reportes)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{ error: error.response?.data?.error || error.response?.data?.detail || error.message },
				{ status: error.response?.status ?? 500 },
			)
		}
		return NextResponse.json(
			{ error: 'Error obteniendo reportes de procesos comerciales' },
			{ status: 500 },
		)
	}
}
