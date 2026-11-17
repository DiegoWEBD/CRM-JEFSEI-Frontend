import type { PolizasPorRangoEdadJson } from '@/aplicacion/metricas/dto/metricas-dashboard-json'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { clavePolizasPorRangoEdad } from './query-keys-metricas'

export const usePolizasPorRangoEdad = (mes?: number, year?: number) => {
	return useQuery({
		queryKey: clavePolizasPorRangoEdad({ mes, year }),
		queryFn: async () => {
			const response = await axios.get<PolizasPorRangoEdadJson>(
				'/api/metricas/polizas-por-rango-edad',
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
