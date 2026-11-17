import type { PrimaPotencialEstimadaJson } from '@/aplicacion/metricas/dto/metricas-dashboard-json'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { clavePrimaPotencialEstimada } from './query-keys-metricas'

export const usePrimaPotencialEstimada = () => {
	return useQuery({
		queryKey: clavePrimaPotencialEstimada(),
		queryFn: async () => {
			const response = await axios.get<PrimaPotencialEstimadaJson>(
				'/api/metricas/prima-potencial-estimada',
			)
			return response.data
		},
		staleTime: 60_000,
	})
}
