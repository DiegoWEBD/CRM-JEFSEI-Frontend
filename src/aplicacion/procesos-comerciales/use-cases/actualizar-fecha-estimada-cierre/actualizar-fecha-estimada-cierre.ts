import axios from 'axios'
import { ActualizarFechaEstimadaCierreRequest } from './dto/actualizar-fecha-estimada-cierre-request'

export const actualizarFechaEstimadaCierre = async (
  idProceso: number,
  request: ActualizarFechaEstimadaCierreRequest,
) => {
  const response = await axios.patch(
    `/api/procesos-comerciales/${idProceso}/fecha-estimada-cierre`,
    request,
  )
  return response.data
}
