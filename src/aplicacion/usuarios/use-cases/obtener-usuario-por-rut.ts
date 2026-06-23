import { axiosClient } from '@/infraestructura/axios/axios-client'
import Usuario from '@/dominio/usuario/usuario'
import { ObtenerUsuariosResponse } from '../dtos/obtener-usuarios-response'

export const obtenerUsuarioPorRut = async (rut: string, cookie: string): Promise<Usuario> => {
	const response = await axiosClient.get(`/usuarios/${rut}`, {
		headers: {
			Cookie: cookie,
		},
	})

	const data: ObtenerUsuariosResponse = response.data
	return data.data as unknown as Usuario
}
