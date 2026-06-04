import axios from 'axios'
import { ActualizarProspectoCondominioRequest } from './dto/requests/actualizar-prospecto-condominio-request'

export const actualizarProspectoCondominio = async (
	id: number,
	request: ActualizarProspectoCondominioRequest,
) => {
	console.log('PUT')
	const response = await axios.put(`/api/prospectos/condominios/${id}`, request)
	const data = response.data

	console.log(data)
	return data
}
