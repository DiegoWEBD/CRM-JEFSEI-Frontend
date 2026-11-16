import type { PrimaPorRamoJson } from '@/aplicacion/metricas/dto/metricas-dashboard-json'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { clavePrimaPorRamo } from './query-keys-metricas'

export const usePrimaPorRamo = (mes?: number, year?: number) => {
	return useQuery({
		queryKey: clavePrimaPorRamo({ mes, year }),
		queryFn: async () => {
			const response = await axios.get<PrimaPorRamoJson>(
				'/api/metricas/prima-por-ramo',
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
