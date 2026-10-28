import { descartarProcesoComercial } from '@/aplicacion/procesos-comerciales/use-cases/descartar-proceso-comercial/descartar-proceso-comercial'
import { DescartarProcesoComercialRequest } from '@/aplicacion/procesos-comerciales/use-cases/descartar-proceso-comercial/dto/descartar-proceso-comercial-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDescartarProcesoComercial = (idProspecto: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      idProceso,
      request,
    }: {
      idProceso: number
      request: DescartarProcesoComercialRequest
    }) => descartarProcesoComercial(idProceso, request),
    onSuccess: () => {
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
