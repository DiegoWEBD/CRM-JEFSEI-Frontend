import { obtenerMetricasEjecutivoComercial } from '@/aplicacion/metricas/use-cases/obtener-metricas-ejecutivo-comercial/obtener-metricas-ejecutivo-comercial'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const metricas = await obtenerMetricasEjecutivoComercial()
		return NextResponse.json(metricas)
	} catch (error) {
		return normalizarErrorServidor(error, 'Error obteniendo métricas')
	}
}
