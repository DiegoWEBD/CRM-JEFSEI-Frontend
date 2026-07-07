import axios from 'axios'

export const obtenerRoles = async () => {
	const response = await axios.get('/api/roles')
	return response.data
}
