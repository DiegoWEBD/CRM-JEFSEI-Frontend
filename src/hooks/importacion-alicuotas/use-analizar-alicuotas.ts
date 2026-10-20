import {
  analizarAlicuotas,
  type AnalizarAlicuotasOpciones,
} from '@/aplicacion/importacion-alicuotas/use-cases/analizar-alicuotas/analizar-alicuotas'
import type { AnalizarAlicuotasResponse } from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import { useMutation } from '@tanstack/react-query'

export const useAnalizarAlicuotas = () => {
  return useMutation<
    AnalizarAlicuotasResponse,
    Error,
    { archivo: File; opciones?: AnalizarAlicuotasOpciones }
  >({
    mutationFn: ({ archivo, opciones }) => analizarAlicuotas(archivo, opciones),
  })
}
