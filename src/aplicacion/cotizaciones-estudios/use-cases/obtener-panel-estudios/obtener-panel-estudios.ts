import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerPanelEstudiosResponse } from '../../dto/obtener-panel-estudios-response'

export type PanelEstudiosQuery = {
  textoBusqueda?: string | null
  estado?: string | null
  prioridad?: string | null
  rutEjecutivo?: string | null
  pagina?: number
  tamanoPagina?: number
}

export const obtenerPanelEstudios = async (
  filtros: PanelEstudiosQuery = {},
): Promise<ObtenerPanelEstudiosResponse> => {
  const cookieStore = await cookies()
  const searchParams = new URLSearchParams()
  if (filtros.textoBusqueda) searchParams.set('texto_busqueda', filtros.textoBusqueda)
  if (filtros.estado) searchParams.set('estado', filtros.estado)
  if (filtros.prioridad) searchParams.set('prioridad', filtros.prioridad)
  if (filtros.rutEjecutivo) searchParams.set('rut_ejecutivo', filtros.rutEjecutivo)
  searchParams.set('pagina', String(filtros.pagina ?? 1))
  searchParams.set('tamano_pagina', String(filtros.tamanoPagina ?? 10))

  const response = await axiosClient.get(
    `/solicitudes-cotizacion/panel-estudios?${searchParams.toString()}`,
    {
      headers: { Cookie: cookieStore.toString() },
    },
  )
  return response.data
}
