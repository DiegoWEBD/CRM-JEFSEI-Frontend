import { obtenerPanelEstudios } from '@/aplicacion/cotizaciones-estudios/use-cases/obtener-panel-estudios/obtener-panel-estudios'
import { normalizarErrorServidor } from '@/utils/axios/normalizar-error-servidor'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const respuesta = await obtenerPanelEstudios({
      textoBusqueda: searchParams.get('texto_busqueda'),
      estado: searchParams.get('estado'),
      prioridad: searchParams.get('prioridad'),
      rutEjecutivo: searchParams.get('rut_ejecutivo'),
      pagina: Number(searchParams.get('pagina')) || 1,
      tamanoPagina: Number(searchParams.get('tamano_pagina')) || 10,
    })
    return NextResponse.json(respuesta)
  } catch (error) {
    return normalizarErrorServidor(error, 'Error obteniendo panel de estudios')
  }
}
