import { asignarEjecutivoEvaluacion } from '@/aplicacion/prospectos/use-cases/asignar-ejecutivo-evaluacion/asignar-ejecutivo-evaluacion'
import { AsignarEjecutivoEvaluacionRequest } from '@/aplicacion/prospectos/use-cases/asignar-ejecutivo-evaluacion/dto/asignar-ejecutivo-evaluacion-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useAsignarEjecutivoEvaluacion = (idProspecto: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: AsignarEjecutivoEvaluacionRequest) =>
      asignarEjecutivoEvaluacion(idProspecto, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['prospecto', idProspecto],
      })
    },
  })
}
