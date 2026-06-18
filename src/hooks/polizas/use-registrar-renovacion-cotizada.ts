import { registrarRenovacionCotizada } from '@/aplicacion/polizas/use-cases/registrar-renovacion-cotizada/registrar-renovacion-cotizada'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useRegistrarRenovacionCotizada = (numeroPoliza: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => registrarRenovacionCotizada(numeroPoliza),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polizas'] })
    },
  })
}
