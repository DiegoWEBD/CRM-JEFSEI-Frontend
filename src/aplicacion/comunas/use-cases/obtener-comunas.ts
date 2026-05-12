import Comuna from '@/dominio/comuna/comuna'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { ObtenerComunasResponse } from '../dto/obtener-comunas-response'

export const obtenerComunas = async (): Promise<Comuna[]> => {
	const axiosResponse = await axiosClient.get('/comunas')
	const response: ObtenerComunasResponse = axiosResponse.data

	return response.comunas
}
