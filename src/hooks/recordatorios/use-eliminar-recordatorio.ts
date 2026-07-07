import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useEliminarRecordatorio = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: number) =>
			axios.delete(`/api/recordatorios/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['recordatorios'],
			})
		},
	})
}
