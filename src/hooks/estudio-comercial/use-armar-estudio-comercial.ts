import { ArmarEstudioResponse, armarEstudioComercial } from '@/aplicacion/estudio-comercial/use-cases/armar-estudio-comercial/armar-estudio-comercial'
import { ArmarEstudioComercialRequest } from '@/aplicacion/estudio-comercial/use-cases/armar-estudio-comercial/dto/armar-estudio-comercial-request'
import { useMutation } from '@tanstack/react-query'

export const useArmarEstudioComercial = () => {
  return useMutation<ArmarEstudioResponse, Error, ArmarEstudioComercialRequest>(
    {
      mutationFn: (request: ArmarEstudioComercialRequest) =>
        armarEstudioComercial(request),
    },
  )
}
