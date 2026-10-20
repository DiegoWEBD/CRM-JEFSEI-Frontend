import type { UnidadAlicuotaRequest } from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import axios from 'axios'

export interface ObtenerUnidadesAlicuotasResponse {
  unidades: UnidadAlicuotaRequest[]
  cantidad: number
}

export const obtenerUnidadesAlicuotas = async (
  idSolicitud: number,
): Promise<ObtenerUnidadesAlicuotasResponse> => {
  const response = await axios.get(`/api/solicitudes-cotizacion/${idSolicitud}/unidades`)
  return response.data
}
