import type AdministradorCondominio from '@/dominio/administrador-condominio/administrador-condominio'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useBuscarAdministradores = (textoBusqueda: string) => {
	return useQuery({
		queryKey: ['administradores-buscar', textoBusqueda],
		queryFn: async () => {
			const params = new URLSearchParams()
			params.set('texto_busqueda', textoBusqueda)
			const response = await axios.get(
				`/api/administradores/todos?${params.toString()}`,
			)
			return response.data as AdministradorCondominio[]
		},
		enabled: textoBusqueda.trim().length > 0,
	})
}
