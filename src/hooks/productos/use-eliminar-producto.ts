import { eliminarProducto } from '@/aplicacion/producto/use-cases/eliminar-producto'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useEliminarProducto = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: number) => eliminarProducto(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['productos'] })
		},
	})
}
