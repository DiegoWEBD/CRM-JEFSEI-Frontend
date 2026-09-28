import axios from 'axios'
import { ActualizarProbabilidadCierreEjecutivoRequest } from './dto/actualizar-probabilidad-cierre-ejecutivo-request'

export const actualizarProbabilidadCierreEjecutivo = async (
  idProceso: number,
  request: ActualizarProbabilidadCierreEjecutivoRequest,
) => {
  const response = await axios.patch(
    `/api/procesos-comerciales/${idProceso}/probabilidad-cierre-ejecutivo`,
    request,
  )
  return response.data
}
