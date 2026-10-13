import {
	actualizarTransicion,
	ActualizarTransicionRequest,
} from '@/aplicacion/estados-admin/use-cases/actualizar-transicion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useActualizarTransicion = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (request: ActualizarTransicionRequest) =>
			actualizarTransicion(request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['transiciones-estado'] })
			toast.success('Transición actualizada')
		},
	})
}
