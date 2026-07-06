import axios from 'axios'
import { ActualizarProspectoRequest } from './dto/requests/actualizar-prospecto-request'

export const actualizarProspecto = async (
	id: number,
	request: ActualizarProspectoRequest,
) => {
	const response = await axios.put(`/api/prospectos/${id}`, request)
	const data = response.data

	return data
}
