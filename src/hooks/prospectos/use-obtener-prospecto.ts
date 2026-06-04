import { Prospecto } from '@/dominio/prospecto/prospecto'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useObtenerProspecto = (prospectoInicial: Prospecto) => {
	return useQuery({
		queryKey: ['prospecto', prospectoInicial.id],
		initialData: prospectoInicial,
		queryFn: async () => {
			const response = await axios.get(`/api/prospectos/${prospectoInicial.id}`)
			const prospecto: Prospecto = response.data

			return prospecto
		},
	})
}
