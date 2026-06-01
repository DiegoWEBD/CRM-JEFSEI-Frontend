import ComunicadoGerencia from '@/dominio/comunicado-gerencia/comunicado-gerencia'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useComunicadosGerencia = () => {
	return useQuery({
		queryKey: ['comunicados-gerencia'],
		queryFn: async () => {
			const response = await axios.get('/api/comunicados-gerencia')
			const comunicados: ComunicadoGerencia[] = response.data
			return comunicados
		},
	})
}
