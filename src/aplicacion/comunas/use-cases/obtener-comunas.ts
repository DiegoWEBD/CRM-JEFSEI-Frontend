import Comuna from '@/dominio/comuna/comuna'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { ObtenerComunasResponse } from '../dto/obtener-comunas-response'
import { cookies } from 'next/headers'

export const obtenerComunas = async (): Promise<Comuna[]> => {
	const cookieStore = await cookies()

	const axiosResponse = await axiosClient.get('/comunas', {
		headers: {
			Cookie: cookieStore.toString(),
		},
	})

	const response: ObtenerComunasResponse = axiosResponse.data
	return response.comunas
}
