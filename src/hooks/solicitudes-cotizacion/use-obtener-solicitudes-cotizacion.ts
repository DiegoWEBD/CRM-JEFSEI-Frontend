import SolicitudCotizacion from '@/dominio/solicitud-cotizacion/solicitud-cotizacion'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useObtenerSolicitudesCotizacion = (idProspecto: number) => {
	return useQuery<SolicitudCotizacion[]>({
		queryKey: ['solicitudes-cotizacion', idProspecto],
		queryFn: async () => {
			const response = await axios.get(
				`/api/solicitudes-cotizacion?id_prospecto=${idProspecto}`,
			)
			const data: SolicitudCotizacion[] = response.data

			return data
		},
	})
}
