import { actualizarProbabilidadCierreEjecutivo } from '@/aplicacion/procesos-comerciales/use-cases/actualizar-probabilidad-cierre-ejecutivo/actualizar-probabilidad-cierre-ejecutivo'
import { ActualizarProbabilidadCierreEjecutivoRequest } from '@/aplicacion/procesos-comerciales/use-cases/actualizar-probabilidad-cierre-ejecutivo/dto/actualizar-probabilidad-cierre-ejecutivo-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useActualizarProbabilidadCierreEjecutivo = (idProspecto: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      idProceso,
      request,
    }: {
      idProceso: number
      request: ActualizarProbabilidadCierreEjecutivoRequest
    }) => actualizarProbabilidadCierreEjecutivo(idProceso, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['procesos-comerciales', idProspecto],
      })
    },
  })
}
