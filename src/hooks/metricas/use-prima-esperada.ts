import type { PrimaEsperadaJson } from '@/aplicacion/metricas/dto/metricas-dashboard-json'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { clavePrimaEsperada } from './query-keys-metricas'

export const usePrimaEsperada = () => {
	return useQuery({
		queryKey: clavePrimaEsperada(),
		queryFn: async () => {
			const response = await axios.get<PrimaEsperadaJson>(
				'/api/metricas/prima-esperada',
			)
			return response.data
		},
		staleTime: 60_000,
	})
}
