import Usuario from '@/dominio/usuario/usuario'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useUsuario = (rut: string) => {
	return useQuery<Usuario>({
		queryKey: ['usuario', rut],
		queryFn: async () => {
			const response = await axios.get(`/api/usuarios/${rut}`)
			return response.data
		},
		enabled: !!rut,
	})
}
