import axios from 'axios'

import type { GestionComercialJson } from '../../dto/gestion-comercial-json'
import type { RegistrarGestionComercialRequest } from './dto/registrar-gestion-comercial-request'

export const registrarGestionComercial = async (
  request: RegistrarGestionComercialRequest,
): Promise<GestionComercialJson> => {
  const response = await axios.post('/api/gestiones-comerciales', request)
  return response.data as GestionComercialJson
}
