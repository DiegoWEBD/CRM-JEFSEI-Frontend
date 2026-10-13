import {
	eliminarTransicion,
	EliminarTransicionRequest,
} from '@/aplicacion/estados-admin/use-cases/eliminar-transicion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useEliminarTransicion = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (request: EliminarTransicionRequest) =>
			eliminarTransicion(request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['transiciones-estado'] })
			queryClient.invalidateQueries({ queryKey: ['estados-configuracion'] })
			toast.success('Transición eliminada')
		},
	})
}
