import axios from 'axios'
import { RegistrarCotizacionRequest } from './dto/registrar-cotizacion-request'

export const registrarCotizacion = async (
  idSolicitud: number,
  request: RegistrarCotizacionRequest,
) => {
  const formData = new FormData()
  formData.append('tipo', request.tipo)
  formData.append('monto_total_asegurado', String(request.monto_total_asegurado))
  formData.append('asistencia_afecta', String(request.asistencia_afecta))
  formData.append('asistencia_excenta', String(request.asistencia_excenta))
  formData.append('id_company', String(request.id_company))
  formData.append('fecha_emision', request.fecha_emision)
  formData.append('fecha_vencimiento', request.fecha_vencimiento)

  if (request.tipo === 'tasa') {
    formData.append('tasa_afecta', String(request.tasa_afecta))
    formData.append('tasa_excenta', String(request.tasa_excenta))
    formData.append('tasa_politica', String(request.tasa_politica))
  } else {
    formData.append('prima_afecta', String(request.prima_afecta))
    formData.append('prima_excenta', String(request.prima_excenta))
  }

  if (request.archivo) {
    formData.append('archivo', request.archivo)
  }

  const response = await axios.post(
    `/api/solicitudes-cotizacion/${idSolicitud}/cotizaciones`,
    formData,
  )
  return response.data
}
