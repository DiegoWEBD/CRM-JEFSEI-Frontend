import Producto from '@/dominio/producto/producto'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useProductosLineaNegocio = (idLineaNegocio: number) => {
	return useQuery<Producto[]>({
		queryKey: ['productos-linea-negocio', idLineaNegocio],
		queryFn: async () => {
			const response = await axios.get(`/api/lineas-negocio/${idLineaNegocio}/productos`)
			return response.data as Producto[]
		},
		enabled: idLineaNegocio > 0,
	})
}
