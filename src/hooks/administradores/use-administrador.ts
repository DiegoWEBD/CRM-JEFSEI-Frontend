import AdministradorCondominio from '@/dominio/administrador-condominio/administrador-condominio'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useAdministrador = (administradorInicial: AdministradorCondominio) => {
	return useQuery({
		queryKey: ['administrador', administradorInicial.id],
		initialData: administradorInicial,
		queryFn: async () => {
			const response = await axios.get(`/api/administradores/${administradorInicial.id}`)
			const data: AdministradorCondominio = response.data
			return data
		},
	})
}
