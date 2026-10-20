import type {
  ConfiguracionImportacionAlicuotas,
  ValidarAlicuotasResponse,
} from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import { validarAlicuotas } from '@/aplicacion/importacion-alicuotas/use-cases/validar-alicuotas/validar-alicuotas'
import { useMutation } from '@tanstack/react-query'

export const useValidarAlicuotas = () => {
  return useMutation<
    ValidarAlicuotasResponse,
    Error,
    { archivo: File; configuracion: ConfiguracionImportacionAlicuotas }
  >({
    mutationFn: ({ archivo, configuracion }) => validarAlicuotas(archivo, configuracion),
  })
}
