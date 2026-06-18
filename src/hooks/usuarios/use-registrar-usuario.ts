import { registrarUsuario, RegistrarUsuarioRequest } from '@/aplicacion/usuarios/use-cases/registrar-usuario'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useRegistrarUsuario = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (request: RegistrarUsuarioRequest) => registrarUsuario(request),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['usuarios'],
			})
		},
	})
}
