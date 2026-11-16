import type { ResumenActividadesJson } from '@/aplicacion/metricas/dto/metricas-dashboard-json'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { claveResumenActividades } from './query-keys-metricas'

export const useResumenActividades = (mes?: number, year?: number) => {
	return useQuery({
		queryKey: claveResumenActividades({ mes, year }),
		queryFn: async () => {
			const response = await axios.get<ResumenActividadesJson>(
				'/api/metricas/resumen-actividades',
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
