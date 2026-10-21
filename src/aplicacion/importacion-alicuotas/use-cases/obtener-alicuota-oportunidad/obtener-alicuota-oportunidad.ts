import type { AlicuotaOportunidadResponse } from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import axios from 'axios'

export const obtenerAlicuotaOportunidad = async (
	idProceso: number,
): Promise<AlicuotaOportunidadResponse> => {
	const response = await axios.get(`/api/procesos-comerciales/${idProceso}/alicuota`)
	return response.data
}
