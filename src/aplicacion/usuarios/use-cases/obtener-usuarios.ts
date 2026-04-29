import Usuario from '@/dominio/usuario/usuario'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { ObtenerUsuariosResponse } from '../dtos/obtener-usuarios-response'

export const obtenerUsuarios = async (): Promise<Usuario[]> => {
	const response = await axiosClient.get('/usuarios')
	const data: ObtenerUsuariosResponse = response.data
	return data.data
}
