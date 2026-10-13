import {
	crearTransicion,
	CrearTransicionRequest,
} from '@/aplicacion/estados-admin/use-cases/crear-transicion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCrearTransicion = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (request: CrearTransicionRequest) => crearTransicion(request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['transiciones-estado'] })
			queryClient.invalidateQueries({ queryKey: ['estados-configuracion'] })
			toast.success('Transición registrada')
		},
	})
}
