import { MetricasDashboardGerenteJson } from './dto/metricas-dashboard-gerente-json'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'

export const obtenerMetricasDashboardGerente = async (): Promise<MetricasDashboardGerenteJson> => {
  const cookieStore = await cookies()

  const response = await axiosClient.get('/metricas/dashboard-gerente', {
    headers: { Cookie: cookieStore.toString() },
  })

  return response.data
}
