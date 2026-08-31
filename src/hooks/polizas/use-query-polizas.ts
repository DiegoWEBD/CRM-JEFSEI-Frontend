import Poliza from '@/dominio/poliza/poliza'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useQueryPolizas = (idCliente?: number) => {
	return useQuery<Poliza[]>({
		queryKey: ['polizas', idCliente],
		queryFn: async () => {
			if (!idCliente) return []

			const response = await axios.get(`/api/polizas?id_cliente=${idCliente}`)
			return response.data.polizas as Poliza[]
		},
	})
}
