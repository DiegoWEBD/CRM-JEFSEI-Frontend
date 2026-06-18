import { obtenerMetricasDashboardGerente } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/obtener-metricas-dashboard-gerente'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const metricas = await obtenerMetricasDashboardGerente()
    return NextResponse.json(metricas)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || error.response?.data?.detail || error.message },
        { status: error.response?.status ?? 500 },
      )
    }
    return NextResponse.json(
      { error: 'Error obteniendo métricas del dashboard' },
      { status: 500 },
    )
  }
}
