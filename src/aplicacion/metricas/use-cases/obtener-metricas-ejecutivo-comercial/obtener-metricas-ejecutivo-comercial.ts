import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerMetricasResponse } from './dto/obtener-metricas-response'
import { MetricasEjecutivoComercialJson } from './dto/metricas-ejecutivo-comercial-json'

export const obtenerMetricasEjecutivoComercial = async (): Promise<MetricasEjecutivoComercialJson> => {
  const cookieStore = await cookies()

  const response = await axiosClient.get('/metricas/ejecutivos-comerciales', {
    headers: { Cookie: cookieStore.toString() },
  })

  const data: ObtenerMetricasResponse = response.data

  return data.data
}
