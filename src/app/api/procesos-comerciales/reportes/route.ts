import type { FiltrosProcesosComerciales } from '@/aplicacion/procesos-comerciales/dto/filtros-procesos-comerciales'
import { obtenerReportesProcesosComerciales } from '@/aplicacion/procesos-comerciales/use-cases/obtener-reportes-procesos-comerciales'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const body: FiltrosProcesosComerciales = await request.json()
		const reportes = await obtenerReportesProcesosComerciales(body)
		return NextResponse.json(reportes)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo reportes de procesos comerciales')
	}
}
