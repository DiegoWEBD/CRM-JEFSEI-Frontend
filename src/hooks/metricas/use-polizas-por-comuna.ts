import type { PolizasPorComunaJson } from '@/aplicacion/metricas/dto/metricas-dashboard-json'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { clavePolizasPorComuna } from './query-keys-metricas'

export const usePolizasPorComuna = (mes?: number, year?: number) => {
	return useQuery({
		queryKey: clavePolizasPorComuna({ mes, year }),
		queryFn: async () => {
			const response = await axios.get<PolizasPorComunaJson>(
				'/api/metricas/polizas-por-comuna',
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
