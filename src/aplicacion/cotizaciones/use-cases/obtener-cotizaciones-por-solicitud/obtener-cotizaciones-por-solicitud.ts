import Cotizacion from '@/dominio/cotizacion/cotizacion'
import { axiosClient } from '@/infraestructura/axios/axios-client'

export const obtenerCotizacionesPorSolicitud = async (
	idSolicitud: number,
	cookie: string,
): Promise<Cotizacion[]> => {
	const response = await axiosClient.get(
		`/solicitudes-cotizacion/${idSolicitud}/cotizaciones`,
		{
			headers: { Cookie: cookie },
		},
	)
	return response.data.cotizaciones
}
