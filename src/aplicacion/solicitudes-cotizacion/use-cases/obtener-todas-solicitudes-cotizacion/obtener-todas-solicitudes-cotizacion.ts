import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerTodasSolicitudesCotizacionResponse } from './dto/obtener-todas-solicitudes-cotizacion-response'

export type SolicitudesCotizacionQuery = {
  textoBusqueda?: string | null
  estado?: string | null
  prioridad?: string | null
  rutUsuario?: string | null
  pagina?: number
  tamanoPagina?: number
}

export const obtenerTodasSolicitudesCotizacion = async (
  filtros: SolicitudesCotizacionQuery = {},
): Promise<ObtenerTodasSolicitudesCotizacionResponse> => {
  const cookieStore = await cookies()
  const searchParams = new URLSearchParams()
  if (filtros.textoBusqueda) searchParams.set('texto_busqueda', filtros.textoBusqueda)
  if (filtros.estado) searchParams.set('estado', filtros.estado)
  if (filtros.prioridad) searchParams.set('prioridad', filtros.prioridad)
  if (filtros.rutUsuario) searchParams.set('rut_usuario', filtros.rutUsuario)
  searchParams.set('pagina', String(filtros.pagina ?? 1))
  searchParams.set('tamano_pagina', String(filtros.tamanoPagina ?? 15))

  const response = await axiosClient.get(
    `/solicitudes-cotizacion?${searchParams.toString()}`,
    {
      headers: { Cookie: cookieStore.toString() },
    },
  )
  return response.data
}
