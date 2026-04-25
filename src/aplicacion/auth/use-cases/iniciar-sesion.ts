import axios from 'axios'
import { IniciarSesionResponse } from '../dtos/iniciar-sesion-response'

export const iniciarSesion = async (
	rut: string,
	password: string,
): Promise<IniciarSesionResponse> => {
	const response = await axios.post(
		`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
		{
			rut,
			password,
		},
	)
	const data: IniciarSesionResponse = response.data
	return data
}
