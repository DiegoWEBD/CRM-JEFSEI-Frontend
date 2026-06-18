import axios from 'axios'
import { AsignarEjecutivoComercialRequest } from './dto/asignar-ejecutivo-comercial-request'

export const asignarEjecutivoComercial = async (
  idProspecto: number,
  request: AsignarEjecutivoComercialRequest,
) => {
  const response = await axios.post(
    `/api/prospectos/${idProspecto}/asignar-ej-comercial`,
    request,
  )
  return response.data
}
