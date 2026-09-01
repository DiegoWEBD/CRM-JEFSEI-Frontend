import { actualizarProducto, ActualizarProductoRequest } from '@/aplicacion/producto/use-cases/actualizar-producto'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useActualizarProducto = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (request: ActualizarProductoRequest) => actualizarProducto(request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['productos'] })
		},
	})
}
