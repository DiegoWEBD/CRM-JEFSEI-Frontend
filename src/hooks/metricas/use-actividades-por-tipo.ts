import type { ActividadesPorTipoJson } from '@/aplicacion/metricas/dto/metricas-dashboard-json'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { claveActividadesPorTipo } from './query-keys-metricas'

export const useActividadesPorTipo = (mes?: number, year?: number) => {
	return useQuery({
		queryKey: claveActividadesPorTipo({ mes, year }),
		queryFn: async () => {
			const response = await axios.get<ActividadesPorTipoJson>(
				'/api/metricas/actividades-por-tipo',
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
