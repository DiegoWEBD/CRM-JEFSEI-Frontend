import axios from 'axios'
import { SolicitudCotizacionUnionRequest } from './dto/solicitud-cotizacion-union-request'

export const solicitarCotizacion = async (request: SolicitudCotizacionUnionRequest) => {
  const response = await axios.post('/api/solicitudes-cotizacion', request)
  return response.data
}
