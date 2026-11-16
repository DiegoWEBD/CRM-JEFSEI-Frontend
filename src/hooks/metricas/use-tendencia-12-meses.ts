import type { Tendencia12MesesJson } from '@/aplicacion/metricas/dto/metricas-dashboard-json'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { claveTendencia12Meses } from './query-keys-metricas'

export const useTendencia12Meses = (mes?: number, year?: number) => {
	return useQuery({
		queryKey: claveTendencia12Meses({ mes, year }),
		queryFn: async () => {
			const response = await axios.get<Tendencia12MesesJson>(
				'/api/metricas/tendencia-12-meses',
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
