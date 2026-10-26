import type {
	ActualizarUnidadesAlicuotaRequest,
	ActualizarUnidadesAlicuotaResponse,
} from '@/aplicacion/importacion-alicuotas/dto/importacion-alicuotas'
import axios from 'axios'

export const actualizarUnidadesAlicuota = async (
	idProceso: number,
	request: ActualizarUnidadesAlicuotaRequest,
): Promise<ActualizarUnidadesAlicuotaResponse> => {
	const response = await axios.patch(
		`/api/procesos-comerciales/${idProceso}/alicuota/unidades`,
		request,
	)

	return response.data
}
