import type {
  ConfiguracionImportacionAlicuotas,
  ValidarAlicuotasResponse,
} from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import axios from 'axios'

export const validarAlicuotas = async (
  archivo: File,
  configuracion: ConfiguracionImportacionAlicuotas,
): Promise<ValidarAlicuotasResponse> => {
  const formData = new FormData()
  formData.append('archivo', archivo)
  formData.append('configuracion', JSON.stringify(configuracion))

  const response = await axios.post('/api/importacion-alicuotas/validar', formData)
  return response.data
}
