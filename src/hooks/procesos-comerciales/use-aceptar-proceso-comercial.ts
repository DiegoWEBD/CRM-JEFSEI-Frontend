import { aceptarProcesoComercial } from '@/aplicacion/procesos-comerciales/use-cases/aceptar-proceso-comercial/aceptar-proceso-comercial'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useAceptarProcesoComercial = (idProceso: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => aceptarProcesoComercial(idProceso),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reportes-procesos-comerciales'],
      })
      queryClient.invalidateQueries({
        queryKey: ['historial-estado', idProceso],
      })
    },
  })
}
