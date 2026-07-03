import { actualizarUsuario, ActualizarUsuarioRequest } from '@/aplicacion/usuarios/use-cases/actualizar-usuario'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useActualizarUsuario = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: ActualizarUsuarioRequest) => actualizarUsuario(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['usuarios'],
      })
    },
  })
}
