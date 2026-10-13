import axios from 'axios'

export interface ActualizarEstadoConfiguracionRequest {
	codigo: string
	/** 0..1 */
	probabilidad_cierre: number
}

export const actualizarEstadoConfiguracion = async (
	request: ActualizarEstadoConfiguracionRequest,
) => {
	const { codigo, ...body } = request

	const response = await axios.patch(
		`/api/estados/${encodeURIComponent(codigo)}/configuracion`,
		body,
	)

	return response.data
}
