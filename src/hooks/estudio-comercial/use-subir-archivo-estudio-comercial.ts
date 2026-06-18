import { useMutation } from '@tanstack/react-query'
import { subirArchivoEstudioComercial } from '@/aplicacion/estudio-comercial/use-cases/subir-archivo-estudio-comercial/subir-archivo-estudio-comercial'

export const useSubirArchivoEstudioComercial = () => {
  return useMutation<void, Error, { idEstudio: number; archivo: File }>({
    mutationFn: ({ idEstudio, archivo }) =>
      subirArchivoEstudioComercial(idEstudio, archivo),
  })
}
