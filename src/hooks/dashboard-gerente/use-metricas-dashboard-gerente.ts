import { MetricasDashboardGerenteJson } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useMetricasDashboardGerente = (mes?: number, year?: number) => {
  return useQuery({
    queryKey: ['metricas-dashboard-gerente', { mes, year }],
    queryFn: async () => {
      const response = await axios.get('/api/metricas/dashboard-gerente', {
        params: {
          ...(mes !== undefined && { mes }),
          ...(year !== undefined && { year }),
        },
      })
      const data: MetricasDashboardGerenteJson = response.data
      return data
    },
  })
}
