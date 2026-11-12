import { obtenerTodasSolicitudesCotizacion } from '@/aplicacion/solicitudes-cotizacion/use-cases/obtener-todas-solicitudes-cotizacion/obtener-todas-solicitudes-cotizacion'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const solicitudes = await obtenerTodasSolicitudesCotizacion({
      textoBusqueda: searchParams.get('texto_busqueda'),
      estado: searchParams.get('estado'),
      prioridad: searchParams.get('prioridad'),
      rutUsuario: searchParams.get('rut_usuario'),
      pagina: Number(searchParams.get('pagina')) || 1,
      tamanoPagina: Number(searchParams.get('tamano_pagina')) || 10,
    })
    return NextResponse.json(solicitudes)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error obteniendo solicitudes')
  }
}
