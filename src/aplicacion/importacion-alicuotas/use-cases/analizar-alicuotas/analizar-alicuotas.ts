import type { AnalizarAlicuotasResponse } from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import axios from 'axios'

export interface AnalizarAlicuotasOpciones {
  hoja?: string
  inicio?: number
  cantidad?: number
}

export const analizarAlicuotas = async (
  archivo: File,
  opciones: AnalizarAlicuotasOpciones = {},
): Promise<AnalizarAlicuotasResponse> => {
  const formData = new FormData()
  formData.append('archivo', archivo)

  if (opciones.hoja) formData.append('hoja', opciones.hoja)
  if (opciones.inicio != null) formData.append('inicio', String(opciones.inicio))
  if (opciones.cantidad != null)
    formData.append('cantidad', String(opciones.cantidad))

  const response = await axios.post('/api/importacion-alicuotas/analizar', formData)
  return response.data
}
