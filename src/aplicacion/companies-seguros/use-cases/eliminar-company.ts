import axios from 'axios'

export const eliminarCompany = async (id: number) => {
	const response = await axios.delete(`/api/companies-seguros/${id}`)
	return response.data
}
