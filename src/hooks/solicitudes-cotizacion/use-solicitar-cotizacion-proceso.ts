import { SolicitudCotizacionUnionRequest } from '@/aplicacion/solicitudes-cotizacion/use-cases/solicitar-cotizacion/dto/solicitud-cotizacion-union-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export const useSolicitarCotizacionProceso = (idProceso: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: SolicitudCotizacionUnionRequest) => {
      const response = await axios.post(
        `/api/procesos-comerciales/${idProceso}/solicitudes-cotizacion`,
        request,
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['solicitudes-proceso', idProceso],
      })
    },
  })
}
