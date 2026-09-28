import {
	crearCompany,
	CrearCompanyRequest,
} from '@/aplicacion/companies-seguros/use-cases/crear-company'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCrearCompany = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (request: CrearCompanyRequest) => crearCompany(request),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['companies-seguros'] })
		},
	})
}
