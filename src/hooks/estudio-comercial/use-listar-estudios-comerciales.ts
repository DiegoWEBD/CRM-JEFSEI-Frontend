import { EstudioComercialCondominioResumen } from '@/aplicacion/estudio-comercial/use-cases/listar-estudios-comerciales/dto/estudio-comercial-condominio-resumen'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const useListarEstudiosComerciales = (prospectoId: number) => {
  return useQuery<EstudioComercialCondominioResumen[]>({
    queryKey: ['estudios-comerciales', prospectoId],
    queryFn: async () => {
      const response = await axios.get(
        `/api/estudio-comercial?prospecto_id=${prospectoId}`,
      )
      return response.data
    },
    enabled: !!prospectoId,
  })
}
