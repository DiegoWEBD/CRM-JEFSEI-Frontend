import type { TasaCierreJson } from '@/aplicacion/metricas/dto/metricas-dashboard-json'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { claveTasaCierre } from './query-keys-metricas'

export const useTasaCierre = () => {
	return useQuery({
		queryKey: claveTasaCierre(),
		queryFn: async () => {
			const response = await axios.get<TasaCierreJson>('/api/metricas/tasa-cierre')
			return response.data
		},
		staleTime: 60_000,
	})
}
