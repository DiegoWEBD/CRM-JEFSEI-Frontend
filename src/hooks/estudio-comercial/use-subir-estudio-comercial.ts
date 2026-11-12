import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  subirEstudioComercial,
  type SubirEstudioComercialResponse,
} from '@/aplicacion/estudio-comercial/use-cases/subir-estudio-comercial/subir-estudio-comercial'

export const useSubirEstudioComercial = (solicitudId: number, idProspecto?: number) => {
  const queryClient = useQueryClient()

  return useMutation<
    SubirEstudioComercialResponse,
    Error,
    { archivo: File }
  >({
    mutationFn: ({ archivo }) =>
      subirEstudioComercial(solicitudId, archivo),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['estudios-comerciales', solicitudId],
      })
      // Refresca también el panel de cotizaciones y estudios emitidos.
      queryClient.invalidateQueries({
        queryKey: ['panel-estudios'],
      })
      if (idProspecto) {
        queryClient.invalidateQueries({
          queryKey: ['procesos-comerciales', idProspecto],
        })
      }
    },
  })
}
