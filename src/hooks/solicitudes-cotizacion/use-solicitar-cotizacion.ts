import { solicitarCotizacion } from '@/aplicacion/solicitudes-cotizacion/use-cases/solicitar-cotizacion/solicitar-cotizacion'
import { SolicitudCotizacionUnionRequest } from '@/aplicacion/solicitudes-cotizacion/use-cases/solicitar-cotizacion/dto/solicitud-cotizacion-union-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useSolicitarCotizacion = (idProspecto: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: SolicitudCotizacionUnionRequest) =>
      solicitarCotizacion(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['solicitudes-cotizacion', idProspecto],
      })
    },
  })
}
