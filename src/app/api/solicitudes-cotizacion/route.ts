import { obtenerTodasSolicitudesCotizacion } from '@/aplicacion/solicitudes-cotizacion/use-cases/obtener-todas-solicitudes-cotizacion/obtener-todas-solicitudes-cotizacion'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const solicitudes = await obtenerTodasSolicitudesCotizacion()
    return NextResponse.json(solicitudes)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error obteniendo solicitudes')
  }
}
