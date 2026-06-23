import { ProcesoComercial } from '@/dominio/proceso-comercial/proceso-comercial'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useObtenerProcesosComerciales = (idProspecto: number) => {
  return useQuery<ProcesoComercial[]>({
    queryKey: ['procesos-comerciales', idProspecto],
    queryFn: async () => {
      const response = await axios.get(
        `/api/prospectos/${idProspecto}/procesos-comerciales`,
      )
      const data = response.data as { oportunidades: ProcesoComercial[] }
      return data.oportunidades ?? []
    },
  })
}
