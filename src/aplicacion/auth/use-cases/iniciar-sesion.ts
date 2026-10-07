import { axiosClient } from '@/infraestructura/axios/axios-client'
import { IniciarSesionResponse } from '../dtos/iniciar-sesion-response'

export const iniciarSesion = async (
	rut: string,
	password: string,
): Promise<IniciarSesionResponse> => {
	const response = await axiosClient.post(`${process.env.API_URL}/auth/login`, {
		rut,
		password,
	})
	const data: IniciarSesionResponse = response.data
	return data
}
