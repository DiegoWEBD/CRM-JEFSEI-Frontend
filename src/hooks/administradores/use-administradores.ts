import AdministradorCondominio from '@/dominio/administrador-condominio/administrador-condominio'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useAdministradores = (
	administradoresIniciales?: AdministradorCondominio[],
) => {
	return useQuery<AdministradorCondominio[]>({
		queryKey: ['administradores'],
		queryFn: async () => {
			const response = await axios.get('/api/administradores')
			return response.data
		},
		initialData: administradoresIniciales,
	})
}
