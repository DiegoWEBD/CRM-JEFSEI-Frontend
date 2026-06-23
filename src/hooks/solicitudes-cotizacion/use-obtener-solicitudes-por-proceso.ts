import SolicitudCotizacion from '@/dominio/solicitud-cotizacion/solicitud-cotizacion'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useObtenerSolicitudesPorProceso = (idProceso: number) => {
  return useQuery<SolicitudCotizacion[]>({
    queryKey: ['solicitudes-proceso', idProceso],
    queryFn: async () => {
      const response = await axios.get(
        `/api/procesos-comerciales/${idProceso}/solicitudes-cotizacion`,
      )
      const data = response.data as { solicitudes: SolicitudCotizacion[] }
      return data.solicitudes ?? []
    },
    enabled: idProceso > 0,
  })
}
