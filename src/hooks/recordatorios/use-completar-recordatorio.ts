import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCompletarRecordatorio = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: number) =>
			axios.patch(`/api/recordatorios/${id}/completar`),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['recordatorios'],
			})
		},
	})
}
