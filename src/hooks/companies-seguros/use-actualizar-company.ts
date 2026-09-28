import {
	actualizarCompany,
	ActualizarCompanyRequest,
} from '@/aplicacion/companies-seguros/use-cases/actualizar-company'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useActualizarCompany = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (request: ActualizarCompanyRequest) =>
			actualizarCompany(request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['companies-seguros'] })
		},
	})
}
