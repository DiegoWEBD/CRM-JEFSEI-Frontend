import { solicitarRecotizacion } from '@/aplicacion/solicitudes-cotizacion/use-cases/solicitar-recotizacion/solicitar-recotizacion'
import { SolicitudCotizacionUnionRequest } from '@/aplicacion/solicitudes-cotizacion/use-cases/solicitar-cotizacion/dto/solicitud-cotizacion-union-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useSolicitarRecotizacion = (idSolicitud: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: SolicitudCotizacionUnionRequest) =>
      solicitarRecotizacion(idSolicitud, request),
    onSuccess: () => {
      // Prefijo: refresca las listas por prospecto y el panel paginado.
      queryClient.invalidateQueries({
        queryKey: ['solicitudes-cotizacion'],
      })
      // Refresca también el panel de cotizaciones y estudios emitidos.
      queryClient.invalidateQueries({
        queryKey: ['panel-estudios'],
      })
    },
  })
}
