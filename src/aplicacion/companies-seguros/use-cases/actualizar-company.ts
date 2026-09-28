import axios from 'axios'

export interface ActualizarCompanyRequest {
	id: number
	nombre: string
}

export const actualizarCompany = async (request: ActualizarCompanyRequest) => {
	const response = await axios.put(
		`/api/companies-seguros/${request.id}`,
		{ nombre: request.nombre },
	)
	return response.data
}
