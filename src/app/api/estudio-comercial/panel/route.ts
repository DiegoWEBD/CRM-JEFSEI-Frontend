import { obtenerPanelEstudios } from '@/aplicacion/cotizaciones-estudios/use-cases/obtener-panel-estudios/obtener-panel-estudios'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const filas = await obtenerPanelEstudios()
    return NextResponse.json(filas)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error obteniendo panel de estudios')
  }
}
