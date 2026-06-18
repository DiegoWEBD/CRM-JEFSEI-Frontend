import axios from 'axios'
import { AsignarEjecutivoEvaluacionRequest } from './dto/asignar-ejecutivo-evaluacion-request'

export const asignarEjecutivoEvaluacion = async (
  idProspecto: number,
  request: AsignarEjecutivoEvaluacionRequest,
) => {
  const response = await axios.post(
    `/api/prospectos/${idProspecto}/asignar-ej-evaluacion`,
    request,
  )
  return response.data
}
