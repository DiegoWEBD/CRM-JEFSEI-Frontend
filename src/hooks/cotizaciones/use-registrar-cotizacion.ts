import { registrarCotizacion } from '@/aplicacion/cotizaciones/use-cases/registrar-cotizacion/registrar-cotizacion'
import { RegistrarCotizacionRequest } from '@/aplicacion/cotizaciones/use-cases/registrar-cotizacion/dto/registrar-cotizacion-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useRegistrarCotizacion = (idSolicitud: number, idProspecto?: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: RegistrarCotizacionRequest) =>
      registrarCotizacion(idSolicitud, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cotizaciones', idSolicitud],
      })
      // Prefijo: refresca las listas por prospecto y el panel paginado.
      queryClient.invalidateQueries({
        queryKey: ['solicitudes-cotizacion'],
      })
      // Refresca también el panel de cotizaciones y estudios emitidos.
      queryClient.invalidateQueries({
        queryKey: ['panel-estudios'],
      })
      if (idProspecto) {
        queryClient.invalidateQueries({
          queryKey: ['procesos-comerciales', idProspecto],
        })
      }
    },
  })
}
