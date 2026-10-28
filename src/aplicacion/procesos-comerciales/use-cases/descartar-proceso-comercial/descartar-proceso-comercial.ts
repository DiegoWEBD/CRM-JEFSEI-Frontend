import axios from 'axios'
import { DescartarProcesoComercialRequest } from './dto/descartar-proceso-comercial-request'

export const descartarProcesoComercial = async (
  idProceso: number,
  request: DescartarProcesoComercialRequest,
) => {
  const response = await axios.post(
    `/api/procesos-comerciales/${idProceso}/descartar`,
    request,
  )
  return response.data
}
