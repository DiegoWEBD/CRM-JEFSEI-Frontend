import axios from 'axios'
import { SolicitudCotizacionUnionRequest } from '../solicitar-cotizacion/dto/solicitud-cotizacion-union-request'

export const solicitarRecotizacion = async (
  idSolicitud: number,
  request: SolicitudCotizacionUnionRequest,
) => {
  const response = await axios.post(
    `/api/solicitudes-cotizacion/${idSolicitud}/recotizacion`,
    request,
  )
  return response.data
}
