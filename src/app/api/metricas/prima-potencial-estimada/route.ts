import { obtenerPrimaPotencialEstimada } from '@/aplicacion/metricas/use-cases/obtener-prima-potencial-estimada/obtener-prima-potencial-estimada'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const metrica = await obtenerPrimaPotencialEstimada()
    return NextResponse.json(metrica)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error obteniendo la prima potencial estimada')
  }
}
