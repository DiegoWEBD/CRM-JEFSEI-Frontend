import type { PrimaCotizadaJson } from '@/aplicacion/metricas/dto/metricas-dashboard-json'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { clavePrimaCotizada } from './query-keys-metricas'

export const usePrimaCotizada = () => {
	return useQuery({
		queryKey: clavePrimaCotizada(),
		queryFn: async () => {
			const response = await axios.get<PrimaCotizadaJson>(
				'/api/metricas/prima-cotizada',
			)
			return response.data
		},
		staleTime: 60_000,
	})
}
