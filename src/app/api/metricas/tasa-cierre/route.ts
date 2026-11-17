import { obtenerTasaCierre } from '@/aplicacion/metricas/use-cases/obtener-tasa-cierre/obtener-tasa-cierre'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const metrica = await obtenerTasaCierre()
    return NextResponse.json(metrica)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error obteniendo la tasa de cierre')
  }
}
