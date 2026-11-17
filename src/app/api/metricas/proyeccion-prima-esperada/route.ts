import { obtenerProyeccionPrimaEsperada } from '@/aplicacion/metricas/use-cases/obtener-proyeccion-prima-esperada/obtener-proyeccion-prima-esperada'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const metrica = await obtenerProyeccionPrimaEsperada()
    return NextResponse.json(metrica)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error obteniendo la proyección de prima esperada')
  }
}
