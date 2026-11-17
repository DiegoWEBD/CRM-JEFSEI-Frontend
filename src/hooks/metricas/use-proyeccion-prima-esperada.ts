import type { ProyeccionPrimaEsperadaJson } from '@/aplicacion/metricas/dto/metricas-dashboard-json'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { claveProyeccionPrimaEsperada } from './query-keys-metricas'

export const useProyeccionPrimaEsperada = () => {
	return useQuery({
		queryKey: claveProyeccionPrimaEsperada(),
		queryFn: async () => {
			const response = await axios.get<ProyeccionPrimaEsperadaJson>(
				'/api/metricas/proyeccion-prima-esperada',
			)
			return response.data
		},
		staleTime: 60_000,
	})
}
