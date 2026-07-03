import { MetricasEjecutivoComercialJson } from '@/aplicacion/metricas/use-cases/obtener-metricas-ejecutivo-comercial/dto/metricas-ejecutivo-comercial-json'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useMetricasEjecutivoComercial = () => {
	return useQuery<MetricasEjecutivoComercialJson>({
		queryKey: ['metricas-ejecutivo-comercial'],
		queryFn: async () => {
			console.log('obteniendo metricas')
			const response = await axios.get('/api/metricas/ejecutivos-comerciales')
			const data: MetricasEjecutivoComercialJson = response.data
			return data
		},
	})
}
