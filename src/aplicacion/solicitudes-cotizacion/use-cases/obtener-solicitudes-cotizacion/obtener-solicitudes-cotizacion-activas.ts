import SolicitudCotizacion from '@/dominio/solicitud-cotizacion/solicitud-cotizacion'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerSolicitudesCotizacionActivasResponse } from './dto/obtener-solicitudes-cotizacion-activas-response'

export const obtenerSolicitudesCotizacionActivas = async (
	idProspecto: number,
): Promise<SolicitudCotizacion[]> => {
	const cookieStore = await cookies()
	const response = await axiosClient.get(
		`/prospectos/${idProspecto}/solicitudes-cotizacion`,
		{
			headers: {
				Cookie: cookieStore.toString(),
			},
		},
	)

	const data: ObtenerSolicitudesCotizacionActivasResponse = response.data
	return data.solicitudes
}
