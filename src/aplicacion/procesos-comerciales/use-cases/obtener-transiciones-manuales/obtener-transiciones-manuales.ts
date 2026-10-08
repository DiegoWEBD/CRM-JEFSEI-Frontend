import axios from 'axios'
import type { TransicionManual } from './dto/transicion-manual'

export const obtenerTransicionesManuales = async (
  idProceso: number,
): Promise<TransicionManual[]> => {
  const response = await axios.get(
    `/api/procesos-comerciales/${idProceso}/transiciones-manuales`,
  )
  return response.data.transiciones
}
