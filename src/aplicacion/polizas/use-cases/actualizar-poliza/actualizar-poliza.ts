import axios from 'axios'
import { ActualizarPolizaRequest } from './dto/requests/actualizar-poliza-request'

export const actualizarPoliza = async (
	numeroPoliza: string,
	request: ActualizarPolizaRequest,
) => {
	const response = await axios.put(`/api/polizas/${numeroPoliza}`, request)
	return response.data
}
