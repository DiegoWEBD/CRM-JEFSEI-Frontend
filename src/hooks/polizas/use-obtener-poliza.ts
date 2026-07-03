import Poliza from '@/dominio/poliza/poliza'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ObtenerPolizaResponse } from '@/aplicacion/polizas/use_cases/dto/obtener_poliza_response'

export const useObtenerPoliza = (numeroPoliza: string) => {
  return useQuery<Poliza>({
    queryKey: ['poliza', numeroPoliza],
    queryFn: async () => {
      const response = await axios.get(`/api/polizas/${numeroPoliza}`)
      const data: ObtenerPolizaResponse = response.data
      return data.poliza
    },
    enabled: Boolean(numeroPoliza),
  })
}
