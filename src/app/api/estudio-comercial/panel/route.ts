import { obtenerPanelEstudios } from '@/aplicacion/cotizaciones-estudios/use-cases/obtener-panel-estudios/obtener-panel-estudios'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const filas = await obtenerPanelEstudios()
    return NextResponse.json(filas)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || error.response?.data?.detail || error.message },
        { status: error.response?.status ?? 500 },
      )
    }
    return NextResponse.json(
      { error: 'Error obteniendo panel de estudios' },
      { status: 500 },
    )
  }
}
