import { eliminarUsuario } from '@/aplicacion/usuarios/use-cases/eliminar-usuario/eliminar-usuario'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useEliminarUsuario = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (rut: string) => eliminarUsuario(rut),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['usuarios'] })
		},
	})
}
