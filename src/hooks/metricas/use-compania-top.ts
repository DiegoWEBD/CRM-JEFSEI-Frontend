import type { CompaniaTopJson } from '@/aplicacion/metricas/dto/metricas-dashboard-json'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { claveCompaniaTop } from './query-keys-metricas'

export const useCompaniaTop = (mes?: number, year?: number) => {
	return useQuery({
		queryKey: claveCompaniaTop({ mes, year }),
		queryFn: async () => {
			const response = await axios.get<CompaniaTopJson>(
				'/api/metricas/compania-top',
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
