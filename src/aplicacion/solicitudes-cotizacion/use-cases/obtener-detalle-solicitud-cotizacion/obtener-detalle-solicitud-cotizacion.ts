import SolicitudCotizacion from '@/dominio/solicitud-cotizacion/solicitud-cotizacion'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerDetalleSolicitudCotizacionResponse } from './dto/obtener-detalle-solicitud-cotizacion-response'

export const obtenerDetalleSolicitudCotizacion = async (
	id: number,
): Promise<SolicitudCotizacion> => {
	const cookieStore = await cookies()
	const response = await axiosClient.get(`/solicitudes-cotizacion/${id}`, {
		headers: { Cookie: cookieStore.toString() },
	})

	const data: ObtenerDetalleSolicitudCotizacionResponse = response.data
	return data.solicitud
}
