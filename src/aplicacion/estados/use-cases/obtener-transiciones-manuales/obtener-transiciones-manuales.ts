import axios from 'axios'
import type { TransicionManual } from './dto/transicion-manual'

export const obtenerTransicionesManuales = async (
  codigoEstado: string,
): Promise<TransicionManual[]> => {
  const response = await axios.get(
    `/api/estados/${encodeURIComponent(codigoEstado)}/transiciones-manuales`,
  )
  return response.data.transiciones
}
