import type { ComisionMensualJson } from '@/aplicacion/metricas/dto/metricas-dashboard-json'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { claveComisionMensual } from './query-keys-metricas'

export const useComisionMensual = (mes?: number, year?: number) => {
	return useQuery({
		queryKey: claveComisionMensual({ mes, year }),
		queryFn: async () => {
			const response = await axios.get<ComisionMensualJson>(
				'/api/metricas/comision-mensual',
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
