import axios from 'axios'
import { ParametrosDepreciacion } from '@/dominio/configuracion-condominio/parametros-depreciacion'

interface GuardarParametrosDepreciacionRequest {
	id?: number
	antiguedad_sin_depreciacion: number
	porcentaje_por_anio: number
	antiguedad_maxima: number
	porcentaje_maximo: number
}

export const guardarParametrosDepreciacion = async (request: GuardarParametrosDepreciacionRequest): Promise<ParametrosDepreciacion> => {
	const response = await axios.put('/api/configuracion-condominio/parametros-depreciacion', request)
	return response.data.data
}
