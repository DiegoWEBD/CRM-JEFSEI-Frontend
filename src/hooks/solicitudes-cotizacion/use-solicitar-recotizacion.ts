import { solicitarRecotizacion } from '@/aplicacion/solicitudes-cotizacion/use-cases/solicitar-recotizacion/solicitar-recotizacion'
import { SolicitudCotizacionUnionRequest } from '@/aplicacion/solicitudes-cotizacion/use-cases/solicitar-cotizacion/dto/solicitud-cotizacion-union-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useSolicitarRecotizacion = (idSolicitud: number, idProspecto: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: SolicitudCotizacionUnionRequest) =>
      solicitarRecotizacion(idSolicitud, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['solicitudes-cotizacion', idProspecto],
      })
    },
  })
}
