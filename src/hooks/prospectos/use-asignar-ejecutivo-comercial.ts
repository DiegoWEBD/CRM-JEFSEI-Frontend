import { asignarEjecutivoComercial } from '@/aplicacion/prospectos/use-cases/asignar-ejecutivo-comercial/asignar-ejecutivo-comercial'
import { AsignarEjecutivoComercialRequest } from '@/aplicacion/prospectos/use-cases/asignar-ejecutivo-comercial/dto/asignar-ejecutivo-comercial-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useAsignarEjecutivoComercial = (idProspecto: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: AsignarEjecutivoComercialRequest) =>
      asignarEjecutivoComercial(idProspecto, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['prospecto', idProspecto],
      })
    },
  })
}
