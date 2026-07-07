import axios from 'axios'

export const marcarPagoCuota = async (idCuota: number) => {
	const response = await axios.post(`/api/cuota/${idCuota}/pagar`)
	return response.data
}
