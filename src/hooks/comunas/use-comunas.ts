import Comuna from '@/dominio/comuna/comuna'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useComunas = () => {
	return useQuery({
		queryKey: ['comunas'],
		queryFn: async () => {
			const response = await axios.get('/api/comunas')
			const data: Comuna[] = response.data
			return data
		},
	})
}
