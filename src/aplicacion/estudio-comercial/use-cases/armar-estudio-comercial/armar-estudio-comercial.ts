import axios from 'axios'
import { ArmarEstudioComercialRequest } from './dto/armar-estudio-comercial-request'
import { EstudioComercialCondominioJson } from './dto/estudio-comercial-condominio-json'

export interface ArmarEstudioResponse {
  estudio_comercial: EstudioComercialCondominioJson
  archivo_base64: string
  nombre_archivo: string
}

export const armarEstudioComercial = async (
  request: ArmarEstudioComercialRequest,
): Promise<ArmarEstudioResponse> => {
  const response = await axios.post('/api/estudio-comercial', request)
  return response.data
}
