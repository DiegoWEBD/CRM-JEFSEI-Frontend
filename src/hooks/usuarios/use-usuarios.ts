import Usuario from '@/dominio/usuario/usuario'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useUsuarios = (usuariosIniciales?: Usuario[]) => {
	return useQuery<Usuario[]>({
		queryKey: ['usuarios'],
		queryFn: async () => {
			const response = await axios.get('/api/usuarios')
			return response.data
		},
		initialData: usuariosIniciales,
	})
}
