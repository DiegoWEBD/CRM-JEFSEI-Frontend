import { ObtenerTransicionesEstadoResponse } from '../dto/transicion-admin'
import axios from 'axios'

export const obtenerTransicionesEstado = async (
	codigoEstado: string,
): Promise<ObtenerTransicionesEstadoResponse> => {
	const response = await axios.get<ObtenerTransicionesEstadoResponse>(
		`/api/estados/${encodeURIComponent(codigoEstado)}/transiciones`,
	)

	return response.data
}
