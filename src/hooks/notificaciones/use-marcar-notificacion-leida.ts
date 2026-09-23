import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useMarcarNotificacionLeida = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: number) => axios.patch(`/api/notificaciones/${id}/leer`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notificaciones'] })
		},
	})
}
