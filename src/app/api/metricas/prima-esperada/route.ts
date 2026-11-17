import { obtenerPrimaEsperada } from '@/aplicacion/metricas/use-cases/obtener-prima-esperada/obtener-prima-esperada'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const metrica = await obtenerPrimaEsperada()
    return NextResponse.json(metrica)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error obteniendo la prima esperada')
  }
}
