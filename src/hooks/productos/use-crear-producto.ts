import { crearProducto, CrearProductoRequest } from '@/aplicacion/producto/use-cases/crear-producto'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCrearProducto = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (request: CrearProductoRequest) => crearProducto(request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['productos'] })
		},
	})
}
