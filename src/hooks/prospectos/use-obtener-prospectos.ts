import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useObtenerProspectos = (initialData: ProspectoResumenJson[]) => {
	return useQuery({
		queryKey: ['prospectos'],
		queryFn: async () => {
			const response = await axios.get('/api/prospectos')
			const data: ProspectoResumenJson[] = response.data
			return data
		},
		initialData,
	})
}
