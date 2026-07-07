import axios from 'axios'

export const reactivarPoliza = async (numeroPoliza: string) => {
	const response = await axios.post(`/api/polizas/${numeroPoliza}/reactivar`)
	return response.data
}
