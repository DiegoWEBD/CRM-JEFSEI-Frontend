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
      if (idProspecto) {
        queryClient.invalidateQueries({
          queryKey: ['solicitudes-cotizacion', idProspecto],
        })
        queryClient.invalidateQueries({
          queryKey: ['procesos-comerciales', idProspecto],
        })
      }
    },
  })
}
