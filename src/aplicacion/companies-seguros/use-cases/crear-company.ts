import axios from 'axios'

export interface CrearCompanyRequest {
	nombre: string
}

export const crearCompany = async (request: CrearCompanyRequest) => {
	const response = await axios.post('/api/companies-seguros', request)
	return response.data
}
