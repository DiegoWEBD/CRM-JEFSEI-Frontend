import Sucursal from '@/dominio/sucursal/sucursal'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useSucursales = () => {
	return useQuery({
		queryKey: ['sucursales'],
		queryFn: async () => {
			const response = await axios.get('/api/sucursales')
			const data: Sucursal[] = response.data
			return data
		},
	})
}
