import SolicitudCotizacionResumen from '@/dominio/solicitud-cotizacion-resumen/solicitud-cotizacion-resumen'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useObtenerTodasSolicitudesCotizacion = () => {
  return useQuery<SolicitudCotizacionResumen[]>({
    queryKey: ['solicitudes-cotizacion'],
    queryFn: async () => {
      const response = await axios.get('/api/solicitudes-cotizacion')
      const data: SolicitudCotizacionResumen[] = response.data
      return data
    },
  })
}
