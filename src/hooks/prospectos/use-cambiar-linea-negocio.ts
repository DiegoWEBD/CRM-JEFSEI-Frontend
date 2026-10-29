import { cambiarLineaNegocioProspecto } from '@/aplicacion/prospectos/use-cases/cambiar-linea-negocio/cambiar-linea-negocio'
import { CambiarLineaNegocioProspectoRequest } from '@/aplicacion/prospectos/use-cases/cambiar-linea-negocio/dto/cambiar-linea-negocio-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCambiarLineaNegocio = (idProspecto: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CambiarLineaNegocioProspectoRequest) =>
      cambiarLineaNegocioProspecto(idProspecto, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['prospecto', idProspecto],
      })
      queryClient.invalidateQueries({
        queryKey: ['prospectos'],
      })
      queryClient.invalidateQueries({
        queryKey: ['procesos-comerciales', idProspecto],
      })
      queryClient.invalidateQueries({
        queryKey: ['historial-estado'],
      })
      queryClient.invalidateQueries({
        queryKey: ['reportes-procesos-comerciales'],
      })
    },
  })
}
