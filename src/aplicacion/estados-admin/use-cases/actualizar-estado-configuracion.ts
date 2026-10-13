import axios from 'axios'

export interface ActualizarEstadoConfiguracionRequest {
	codigo: string
	/** null = sin límite de permanencia */
	dias_limite: number | null
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
