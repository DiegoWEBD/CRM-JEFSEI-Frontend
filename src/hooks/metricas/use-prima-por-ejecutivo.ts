import type { PrimaPorEjecutivoJson } from '@/aplicacion/metricas/dto/metricas-dashboard-json'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { clavePrimaPorEjecutivo } from './query-keys-metricas'

export const usePrimaPorEjecutivo = (mes?: number, year?: number) => {
	return useQuery({
		queryKey: clavePrimaPorEjecutivo({ mes, year }),
		queryFn: async () => {
			const response = await axios.get<PrimaPorEjecutivoJson>(
				'/api/metricas/prima-por-ejecutivo',
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
