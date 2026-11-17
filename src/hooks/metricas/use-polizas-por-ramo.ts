import type { PolizasPorRamoJson } from '@/aplicacion/metricas/dto/metricas-dashboard-json'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { clavePolizasPorRamo } from './query-keys-metricas'

export const usePolizasPorRamo = (mes?: number, year?: number) => {
	return useQuery({
		queryKey: clavePolizasPorRamo({ mes, year }),
		queryFn: async () => {
			const response = await axios.get<PolizasPorRamoJson>(
				'/api/metricas/polizas-por-ramo',
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
