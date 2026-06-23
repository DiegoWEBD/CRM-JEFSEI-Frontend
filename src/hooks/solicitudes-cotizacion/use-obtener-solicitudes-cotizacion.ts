import SolicitudCotizacion from '@/dominio/solicitud-cotizacion/solicitud-cotizacion'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useObtenerSolicitudesCotizacion = (idProspecto: number) => {
	return useQuery<SolicitudCotizacion[]>({
		queryKey: ['solicitudes-cotizacion', idProspecto],
		queryFn: async () => {
			const response = await axios.get(
				`/api/prospectos/${idProspecto}/solicitudes-cotizacion`,
			)
			const data: SolicitudCotizacion[] = response.data

			return data
		},
	})
}
