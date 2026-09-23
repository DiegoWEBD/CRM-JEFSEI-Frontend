import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useMarcarNotificacionesLeidas = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: () => axios.post('/api/notificaciones/leer-todas'),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notificaciones'] })
		},
	})
}
