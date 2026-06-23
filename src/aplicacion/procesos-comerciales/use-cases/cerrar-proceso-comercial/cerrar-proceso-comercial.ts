import axios from 'axios'
import { CerrarProcesoComercialRequest } from './dto/cerrar-proceso-comercial-request'

export const cerrarProcesoComercial = async (
  idProceso: number,
  request: CerrarProcesoComercialRequest,
) => {
  const response = await axios.post(
    `/api/procesos-comerciales/${idProceso}/cerrar`,
    request,
  )
  return response.data
}
