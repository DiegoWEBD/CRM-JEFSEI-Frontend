import { solicitarCotizacion } from '@/aplicacion/solicitudes-cotizacion/use-cases/solicitar-cotizacion/solicitar-cotizacion'
import { SolicitudCotizacionUnionRequest } from '@/aplicacion/solicitudes-cotizacion/use-cases/solicitar-cotizacion/dto/solicitud-cotizacion-union-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useSolicitarCotizacion = (idProspecto: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: SolicitudCotizacionUnionRequest) =>
      solicitarCotizacion(request),
    onSuccess: () => {
      // Prefijo: refresca las listas por prospecto y el panel paginado.
      queryClient.invalidateQueries({
        queryKey: ['solicitudes-cotizacion'],
      })
      queryClient.invalidateQueries({
        queryKey: ['procesos-comerciales', idProspecto],
      })
    },
  })
}
