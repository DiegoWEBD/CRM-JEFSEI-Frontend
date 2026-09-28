import {
	actualizarFactoresCuotas,
	ActualizarFactoresCuotasRequest,
} from '@/aplicacion/companies-seguros/use-cases/actualizar-factores-cuotas'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useActualizarFactoresCuotas = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (request: ActualizarFactoresCuotasRequest) =>
			actualizarFactoresCuotas(request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['companies-seguros'] })
		},
	})
}
