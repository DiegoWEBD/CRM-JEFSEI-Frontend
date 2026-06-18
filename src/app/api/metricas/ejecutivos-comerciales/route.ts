import { obtenerMetricasEjecutivoComercial } from '@/aplicacion/metricas/use-cases/obtener-metricas-ejecutivo-comercial/obtener-metricas-ejecutivo-comercial'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const metricas = await obtenerMetricasEjecutivoComercial()
    return NextResponse.json(metricas)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || error.response?.data?.detail || error.message },
        { status: error.response?.status ?? 500 },
      )
    }
    return NextResponse.json(
      { error: 'Error obteniendo métricas' },
      { status: 500 },
    )
  }
}
