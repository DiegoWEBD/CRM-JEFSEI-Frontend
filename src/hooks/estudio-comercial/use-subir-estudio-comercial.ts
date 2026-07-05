import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  subirEstudioComercial,
  type SubirEstudioComercialResponse,
} from '@/aplicacion/estudio-comercial/use-cases/subir-estudio-comercial/subir-estudio-comercial'

export const useSubirEstudioComercial = (solicitudId: number) => {
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
    },
  })
}
