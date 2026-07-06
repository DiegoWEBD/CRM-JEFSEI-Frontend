import { registrarGestionComercial } from '@/aplicacion/gestion-comercial/use-cases/registrar-gestion-comercial/registrar-gestion-comercial'
import type { RegistrarGestionComercialRequest } from '@/aplicacion/gestion-comercial/use-cases/registrar-gestion-comercial/dto/registrar-gestion-comercial-request'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useRegistrarGestionComercial = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: RegistrarGestionComercialRequest) =>
      registrarGestionComercial(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gestiones-comerciales'] })
      queryClient.invalidateQueries({ queryKey: ['gestion-comercial-final'] })
    },
  })
}
