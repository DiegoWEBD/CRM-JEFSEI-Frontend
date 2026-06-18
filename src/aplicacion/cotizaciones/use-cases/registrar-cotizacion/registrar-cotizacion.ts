import axios from 'axios'
import { RegistrarCotizacionRequest } from './dto/registrar-cotizacion-request'

export const registrarCotizacion = async (
  idSolicitud: number,
  request: RegistrarCotizacionRequest,
) => {
  const response = await axios.post(
    `/api/solicitudes-cotizacion/${idSolicitud}/cotizaciones`,
    request,
  )
  return response.data
}
