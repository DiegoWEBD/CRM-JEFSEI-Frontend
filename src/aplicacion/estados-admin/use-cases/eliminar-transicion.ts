import axios from 'axios'

export interface EliminarTransicionRequest {
	codigo_estado_origen: string
	codigo_estado_destino: string
}

export const eliminarTransicion = async (
	request: EliminarTransicionRequest,
) => {
	const { codigo_estado_origen, codigo_estado_destino } = request

	const response = await axios.delete(
		`/api/estados/${encodeURIComponent(codigo_estado_origen)}/transiciones/${encodeURIComponent(codigo_estado_destino)}`,
	)

	return response.data
}
