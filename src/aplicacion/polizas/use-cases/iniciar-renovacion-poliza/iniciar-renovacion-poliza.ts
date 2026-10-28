import axios from 'axios'

export interface IniciarRenovacionPolizaResponse {
	message: string
	id_proceso_comercial: number
}

export const iniciarRenovacionPoliza = async (
	numeroPoliza: string,
): Promise<IniciarRenovacionPolizaResponse> => {
	const response = await axios.post<IniciarRenovacionPolizaResponse>(
		`/api/polizas/${numeroPoliza}/iniciar-renovacion`,
	)
	return response.data
}
