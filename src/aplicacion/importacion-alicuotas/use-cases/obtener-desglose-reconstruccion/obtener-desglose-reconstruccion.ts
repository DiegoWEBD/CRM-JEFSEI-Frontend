import type { DesgloseReconstruccionResponse } from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import axios from 'axios'

export const obtenerDesgloseReconstruccion = async (
	idProceso: number,
): Promise<DesgloseReconstruccionResponse> => {
	const response = await axios.get(
		`/api/procesos-comerciales/${idProceso}/desglose-reconstruccion`,
	)
	return response.data
}
