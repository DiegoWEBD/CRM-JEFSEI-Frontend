import axios from 'axios'

export const cancelarPoliza = async (numeroPoliza: string) => {
	const response = await axios.post(`/api/polizas/${numeroPoliza}/cancelar`)
	return response.data
}
