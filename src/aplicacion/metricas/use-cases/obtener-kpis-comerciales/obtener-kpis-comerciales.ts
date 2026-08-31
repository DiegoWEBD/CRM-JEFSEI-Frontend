import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { KpisComercialesJson } from './dto/kpis-comerciales-json'

export const obtenerKpisComerciales = async (
  mes?: number,
  year?: number,
): Promise<KpisComercialesJson> => {
  const cookieStore = await cookies()

  const response = await axiosClient.get('/metricas/kpis-comerciales', {
    headers: { Cookie: cookieStore.toString() },
    params: {
      ...(mes !== undefined && { month: mes }),
      ...(year !== undefined && { year }),
    },
  })

  return response.data
}
