import LineaNegocio from '@/dominio/linea-negocio/linea-negocio'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useLineasNegocio = () => {
	return useQuery({
		queryKey: ['lineas_negocio'],
		queryFn: async () => {
			const response = await axios.get('/api/lineas-negocio')
			const data: LineaNegocio[] = response.data

			return data
		},
	})
}
