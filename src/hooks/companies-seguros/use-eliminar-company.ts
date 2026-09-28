import { eliminarCompany } from '@/aplicacion/companies-seguros/use-cases/eliminar-company'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useEliminarCompany = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: number) => eliminarCompany(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['companies-seguros'] })
		},
	})
}
