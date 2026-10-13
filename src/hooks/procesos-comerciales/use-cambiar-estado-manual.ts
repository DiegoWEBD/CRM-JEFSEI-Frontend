import { cambiarEstadoManual } from '@/aplicacion/procesos-comerciales/use-cases/cambiar-estado-manual/cambiar-estado-manual'
import { CambiarEstadoManualRequest } from '@/aplicacion/procesos-comerciales/use-cases/cambiar-estado-manual/dto/cambiar-estado-manual-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCambiarEstadoManual = (idProspecto: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      idProceso,
      request,
    }: {
      idProceso: number
      request: CambiarEstadoManualRequest
    }) => cambiarEstadoManual(idProceso, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['procesos-comerciales', idProspecto],
      })
      queryClient.invalidateQueries({
        queryKey: ['historial-estado'],
      })
    },
  })
}
