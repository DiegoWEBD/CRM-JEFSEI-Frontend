import type { TendenciaAnualJson } from '@/aplicacion/metricas/dto/metricas-dashboard-json'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { claveTendenciaAnual } from './query-keys-metricas'

export const useTendenciaAnual = (mes?: number, year?: number) => {
	return useQuery({
		queryKey: claveTendenciaAnual({ mes, year }),
		queryFn: async () => {
			const response = await axios.get<TendenciaAnualJson>(
				'/api/metricas/tendencia-anual',
				{
					params: {
						...(mes !== undefined && { mes }),
						...(year !== undefined && { year }),
					},
				},
			)
			return response.data
		},
		placeholderData: keepPreviousData,
		staleTime: 60_000,
	})
}
