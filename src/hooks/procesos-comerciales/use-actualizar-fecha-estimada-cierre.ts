import { actualizarFechaEstimadaCierre } from '@/aplicacion/procesos-comerciales/use-cases/actualizar-fecha-estimada-cierre/actualizar-fecha-estimada-cierre'
import { ActualizarFechaEstimadaCierreRequest } from '@/aplicacion/procesos-comerciales/use-cases/actualizar-fecha-estimada-cierre/dto/actualizar-fecha-estimada-cierre-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useActualizarFechaEstimadaCierre = (idProspecto: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      idProceso,
      request,
    }: {
      idProceso: number
      request: ActualizarFechaEstimadaCierreRequest
    }) => actualizarFechaEstimadaCierre(idProceso, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['procesos-comerciales', idProspecto],
      })
    },
  })
}
