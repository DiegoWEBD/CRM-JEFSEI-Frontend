import type { PolizasPorSexoJson } from '@/aplicacion/metricas/dto/metricas-dashboard-json'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { clavePolizasPorSexo } from './query-keys-metricas'

export const usePolizasPorSexo = (mes?: number, year?: number) => {
	return useQuery({
		queryKey: clavePolizasPorSexo({ mes, year }),
		queryFn: async () => {
			const response = await axios.get<PolizasPorSexoJson>(
				'/api/metricas/polizas-por-sexo',
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
