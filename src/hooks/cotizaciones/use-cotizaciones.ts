import Cotizacion from '@/dominio/cotizacion/cotizacion'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useCotizaciones = (idSolicitud: number) => {
  return useQuery<Cotizacion[]>({
    queryKey: ['cotizaciones', idSolicitud],
    queryFn: async () => {
      const response = await axios.get(
        `/api/solicitudes-cotizacion/${idSolicitud}/cotizaciones`,
      )
      return response.data
    },
    enabled: !!idSolicitud,
  })
}
