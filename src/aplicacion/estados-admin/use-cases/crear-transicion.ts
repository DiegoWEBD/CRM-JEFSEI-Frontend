import axios from 'axios'

export interface CrearTransicionRequest {
	codigo_estado_origen: string
	codigo_estado_destino: string
	es_manual: boolean
	accion_requerida: string | null
}

export const crearTransicion = async (request: CrearTransicionRequest) => {
	const { codigo_estado_origen, ...body } = request

	const response = await axios.post(
		`/api/estados/${encodeURIComponent(codigo_estado_origen)}/transiciones`,
		body,
	)

	return response.data
}
