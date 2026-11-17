import { obtenerPolizasPorRamo } from '@/aplicacion/metricas/use-cases/obtener-polizas-por-ramo/obtener-polizas-por-ramo'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mes = searchParams.get('mes') ? Number(searchParams.get('mes')) : undefined
    const year = searchParams.get('year') ? Number(searchParams.get('year')) : undefined

    const metrica = await obtenerPolizasPorRamo(mes, year)
    return NextResponse.json(metrica)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error obteniendo las pólizas por ramo')
  }
}
