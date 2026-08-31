import { KpisComercialesJson } from '@/aplicacion/metricas/use-cases/obtener-kpis-comerciales/dto/kpis-comerciales-json'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useKpisComerciales = (mes?: number, year?: number) => {
  return useQuery({
    queryKey: ['kpis-comerciales', { mes, year }],
    queryFn: async () => {
      const response = await axios.get<KpisComercialesJson>('/api/metricas/kpis-comerciales', {
        params: {
          ...(mes !== undefined && { mes }),
          ...(year !== undefined && { year }),
        },
      })
      return response.data
    },
  })
}
