import {
	actualizarPerfil,
	ActualizarPerfilRequest,
} from '@/aplicacion/usuarios/use-cases/actualizar-perfil'
import { useUserSession } from '@/hooks/auth/use-user-session'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useActualizarPerfil = () => {
  const queryClient = useQueryClient()
  const { usuario } = useUserSession()

  return useMutation({
    mutationFn: ({ rut, request }: { rut: string; request: ActualizarPerfilRequest }) =>
      actualizarPerfil(rut, request),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usuario', variables.rut] })
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })

      // Refleja el nombre nuevo en el header de inmediato. Los claims del JWT
      // se rehacen solos en la próxima rotación del access token.
      if (usuario) {
        window.dispatchEvent(
          new CustomEvent('session-refreshed', {
            detail: { ...usuario, nombre: variables.request.nombre },
          }),
        )
      }
    },
  })
}
