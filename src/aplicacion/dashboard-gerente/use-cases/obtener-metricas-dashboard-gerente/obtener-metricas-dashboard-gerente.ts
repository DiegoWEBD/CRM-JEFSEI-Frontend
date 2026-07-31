import { MetricasDashboardGerenteJson } from './dto/metricas-dashboard-gerente-json'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'

export const obtenerMetricasDashboardGerente = async (
  mes?: number,
  year?: number,
): Promise<MetricasDashboardGerenteJson> => {
  const cookieStore = await cookies()

  const response = await axiosClient.get('/metricas/dashboard-gerente', {
    headers: { Cookie: cookieStore.toString() },
    params: {
      ...(mes !== undefined && { mes }),
      ...(year !== undefined && { year }),
    },
  })

  return response.data
}
