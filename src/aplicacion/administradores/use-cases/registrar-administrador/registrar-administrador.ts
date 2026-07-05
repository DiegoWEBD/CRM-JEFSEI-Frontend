import axios from 'axios'
import type AdministradorCondominio from '@/dominio/administrador-condominio/administrador-condominio'
import type { RegistrarAdministradorRequest } from './dto/registrar-administrador-request'

export const registrarAdministrador = async (
	request: RegistrarAdministradorRequest,
): Promise<AdministradorCondominio> => {
	const response = await axios.post('/api/administradores', request)
	return response.data.data
}
