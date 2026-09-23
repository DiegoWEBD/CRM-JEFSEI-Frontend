import { ObtenerContadorNoLeidasResponse } from '@/types/notificaciones/notificacion'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useContadorNoLeidas = (enabled = true) => {
	return useQuery<ObtenerContadorNoLeidasResponse>({
		queryKey: ['notificaciones', 'contador'],
		queryFn: async () => {
			const response = await axios.get('/api/notificaciones/contador')
			return response.data as ObtenerContadorNoLeidasResponse
		},
		enabled,
		refetchInterval: 60_000,
	})
}
