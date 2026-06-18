import { MetricasDashboardGerenteJson } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useMetricasDashboardGerente = () => {
  return useQuery({
    queryKey: ['metricas-dashboard-gerente'],
    queryFn: async () => {
      const response = await axios.get('/api/metricas/dashboard-gerente')
      const data: MetricasDashboardGerenteJson = response.data
      return data
    },
  })
}
