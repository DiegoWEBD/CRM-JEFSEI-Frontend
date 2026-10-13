import axios from 'axios'

export interface ActualizarTransicionRequest {
	codigo_estado_origen: string
	codigo_estado_destino: string
	es_manual: boolean
	accion_requerida: string | null
	/**
	 * SLA de permanencia (días). Solo aplica a la transición principal;
	 * para las secundarias se envía null.
	 */
	dias_limite: number | null
}

export const actualizarTransicion = async (
	request: ActualizarTransicionRequest,
) => {
	const { codigo_estado_origen, codigo_estado_destino, ...body } = request

	const response = await axios.put(
		`/api/estados/${encodeURIComponent(codigo_estado_origen)}/transiciones/${encodeURIComponent(codigo_estado_destino)}`,
		body,
	)

	return response.data
}
