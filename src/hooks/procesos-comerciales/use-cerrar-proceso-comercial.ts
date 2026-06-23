import { cerrarProcesoComercial } from '@/aplicacion/procesos-comerciales/use-cases/cerrar-proceso-comercial/cerrar-proceso-comercial'
import { CerrarProcesoComercialRequest } from '@/aplicacion/procesos-comerciales/use-cases/cerrar-proceso-comercial/dto/cerrar-proceso-comercial-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCerrarProcesoComercial = (idProceso: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CerrarProcesoComercialRequest) =>
      cerrarProcesoComercial(idProceso, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reportes-procesos-comerciales'],
      })
    },
  })
}
