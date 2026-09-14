import { obtenerKpisComerciales } from '@/aplicacion/metricas/use-cases/obtener-kpis-comerciales/obtener-kpis-comerciales'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mes = searchParams.get('mes') ? Number(searchParams.get('mes')) : undefined
    const year = searchParams.get('year') ? Number(searchParams.get('year')) : undefined

    const kpis = await obtenerKpisComerciales(mes, year)
    return NextResponse.json(kpis)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error obteniendo KPIs comerciales')
  }
}
