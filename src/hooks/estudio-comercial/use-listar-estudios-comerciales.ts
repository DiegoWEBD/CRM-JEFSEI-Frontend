import { EstudioComercialCondominioResumen } from '@/aplicacion/estudio-comercial/use-cases/listar-estudios-comerciales/dto/estudio-comercial-condominio-resumen'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useListarEstudiosComerciales = (solicitudId: number) => {
  return useQuery<EstudioComercialCondominioResumen[]>({
    queryKey: ['estudios-comerciales', solicitudId],
    queryFn: async () => {
      const response = await axios.get(
        `/api/solicitudes-cotizacion/${solicitudId}/estudios-comerciales`,
      )
      return response.data
    },
    enabled: !!solicitudId,
  })
}
