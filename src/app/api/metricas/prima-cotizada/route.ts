import { obtenerPrimaCotizada } from '@/aplicacion/metricas/use-cases/obtener-prima-cotizada/obtener-prima-cotizada'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const metrica = await obtenerPrimaCotizada()
    return NextResponse.json(metrica)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error obteniendo la prima cotizada')
  }
}
