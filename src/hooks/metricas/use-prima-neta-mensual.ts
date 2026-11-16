import type { PrimaNetaMensualJson } from '@/aplicacion/metricas/dto/metricas-dashboard-json'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { clavePrimaNetaMensual } from './query-keys-metricas'

export const usePrimaNetaMensual = (mes?: number, year?: number) => {
	return useQuery({
		queryKey: clavePrimaNetaMensual({ mes, year }),
		queryFn: async () => {
			const response = await axios.get<PrimaNetaMensualJson>(
				'/api/metricas/prima-neta-mensual',
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
