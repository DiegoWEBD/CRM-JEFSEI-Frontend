import { obtenerTodasSolicitudesCotizacion } from '@/aplicacion/solicitudes-cotizacion/use-cases/obtener-todas-solicitudes-cotizacion/obtener-todas-solicitudes-cotizacion'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const solicitudes = await obtenerTodasSolicitudesCotizacion()
    return NextResponse.json(solicitudes)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.error || error.response?.data?.detail || error.message },
        { status: error.response?.status ?? 500 },
      )
    }
    return NextResponse.json(
      { error: 'Error obteniendo solicitudes' },
      { status: 500 },
    )
  }
}
