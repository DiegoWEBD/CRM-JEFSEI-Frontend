import { obtenerPrimaNetaMensual } from '@/aplicacion/metricas/use-cases/obtener-prima-neta-mensual/obtener-prima-neta-mensual'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mes = searchParams.get('mes') ? Number(searchParams.get('mes')) : undefined
    const year = searchParams.get('year') ? Number(searchParams.get('year')) : undefined

    const metrica = await obtenerPrimaNetaMensual(mes, year)
    return NextResponse.json(metrica)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error obteniendo la prima neta mensual')
  }
}
