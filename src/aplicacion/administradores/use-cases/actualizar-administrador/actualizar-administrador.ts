import axios from 'axios'
import type AdministradorCondominio from '@/dominio/administrador-condominio/administrador-condominio'
import type { ActualizarAdministradorRequest } from './dto/actualizar-administrador-request'

export const actualizarAdministrador = async (
	id: number,
	request: ActualizarAdministradorRequest,
): Promise<AdministradorCondominio> => {
	const response = await axios.put(`/api/administradores/${id}`, request)
	return response.data.data
}
