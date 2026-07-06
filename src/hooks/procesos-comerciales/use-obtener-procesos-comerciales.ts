import { ProcesoComercial } from '@/dominio/proceso-comercial/proceso-comercial'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useObtenerProcesosComerciales = (idProspecto: number, abiertos?: boolean) => {
  return useQuery<ProcesoComercial[]>({
    queryKey: ['procesos-comerciales', idProspecto, abiertos],
    queryFn: async () => {
      const params = abiertos !== undefined ? { abiertos } : undefined
      const response = await axios.get(
        `/api/prospectos/${idProspecto}/procesos-comerciales`,
        { params },
      )
      const data = response.data as { oportunidades: ProcesoComercial[] }
      return data.oportunidades ?? []
    },
  })
}
