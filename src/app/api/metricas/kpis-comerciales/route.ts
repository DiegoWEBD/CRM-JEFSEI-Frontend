import { obtenerKpisComerciales } from '@/aplicacion/metricas/use-cases/obtener-kpis-comerciales/obtener-kpis-comerciales'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mes = searchParams.get('mes') ? Number(searchParams.get('mes')) : undefined
    const year = searchParams.get('year') ? Number(searchParams.get('year')) : undefined

    const kpis = await obtenerKpisComerciales(mes, year)
    return NextResponse.json(kpis)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || error.response?.data?.detail || error.message },
        { status: error.response?.status ?? 500 },
      )
    }
    return NextResponse.json(
      { error: 'Error obteniendo KPIs comerciales' },
      { status: 500 },
    )
  }
}
