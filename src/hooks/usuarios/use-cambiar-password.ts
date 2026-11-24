import {
	cambiarPassword,
	CambiarPasswordRequest,
} from '@/aplicacion/usuarios/use-cases/cambiar-password'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCambiarPassword = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ rut, request }: { rut: string; request: CambiarPasswordRequest }) =>
      cambiarPassword(rut, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      // Las demás sesiones del usuario fueron revocadas en el backend
      queryClient.invalidateQueries({ queryKey: ['sesiones'] })
    },
  })
}
