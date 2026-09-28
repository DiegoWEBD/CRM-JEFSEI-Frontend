import axios from 'axios'

export interface FactorCuotaRequest {
	numero_cuotas: number
	factor: number
}

export interface ActualizarFactoresCuotasRequest {
	id: number
	factores: FactorCuotaRequest[]
}

export const actualizarFactoresCuotas = async (
	request: ActualizarFactoresCuotasRequest,
) => {
	const response = await axios.put(
		`/api/companies-seguros/${request.id}/factores-cuotas`,
		{ factores: request.factores },
	)
	return response.data
}
