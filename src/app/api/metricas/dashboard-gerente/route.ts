import { obtenerMetricasDashboardGerente } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/obtener-metricas-dashboard-gerente'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mes = searchParams.get('mes') ? Number(searchParams.get('mes')) : undefined
    const year = searchParams.get('year') ? Number(searchParams.get('year')) : undefined

    const metricas = await obtenerMetricasDashboardGerente(mes, year)
    return NextResponse.json(metricas)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error obteniendo métricas del dashboard')
  }
}
