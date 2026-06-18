import { obtenerSolicitudesCotizacionActivas } from '@/aplicacion/solicitudes-cotizacion/use-cases/obtener-solicitudes-cotizacion/obtener-solicitudes-cotizacion-activas'
import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const solicitudes = await obtenerSolicitudesCotizacionActivas(
      Number(id),
    )
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
