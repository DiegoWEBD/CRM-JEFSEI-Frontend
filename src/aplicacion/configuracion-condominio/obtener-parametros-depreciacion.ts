import axios from 'axios'
import { ParametrosDepreciacion } from '@/dominio/configuracion-condominio/parametros-depreciacion'

export const obtenerParametrosDepreciacion = async (): Promise<ParametrosDepreciacion | null> => {
	const response = await axios.get('/api/configuracion-condominio/parametros-depreciacion')
	return response.data.data ?? null
}
