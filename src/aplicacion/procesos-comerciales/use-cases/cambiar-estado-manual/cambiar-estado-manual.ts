import axios from 'axios'
import type { CambiarEstadoManualRequest } from './dto/cambiar-estado-manual-request'

export const cambiarEstadoManual = async (
  idProceso: number,
  request: CambiarEstadoManualRequest,
) => {
  const response = await axios.post(
    `/api/procesos-comerciales/${idProceso}/cambiar-estado`,
    request,
  )
  return response.data
}
