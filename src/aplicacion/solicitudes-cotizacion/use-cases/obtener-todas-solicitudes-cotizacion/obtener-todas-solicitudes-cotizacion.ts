import SolicitudCotizacionResumen from '@/dominio/solicitud-cotizacion-resumen/solicitud-cotizacion-resumen'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerTodasSolicitudesCotizacionResponse } from './dto/obtener-todas-solicitudes-cotizacion-response'

export const obtenerTodasSolicitudesCotizacion = async (): Promise<SolicitudCotizacionResumen[]> => {
  const cookieStore = await cookies()
  const response = await axiosClient.get('/solicitudes-cotizacion', {
    headers: { Cookie: cookieStore.toString() },
  })
  const data: ObtenerTodasSolicitudesCotizacionResponse = response.data
  return data.solicitudes
}
