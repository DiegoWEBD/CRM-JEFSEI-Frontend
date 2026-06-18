import axios from 'axios'
import { CrearProspectoRequest } from '@/app/api/prospectos/dto/requests/crear-prospecto-request'

export const registrarProspecto = async (request: CrearProspectoRequest) => {
  await axios.post('/api/prospectos', request)
}
