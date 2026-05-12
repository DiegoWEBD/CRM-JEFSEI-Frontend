import { axiosClient } from '@/infraestructura/axios/axios-client'
import { ObtenerLineasNegocioResponse } from '../dto/obtener-lineas-negocio-response'
import LineaNegocio from '@/dominio/linea-negocio/linea-negocio'

export const obtenerLineasNegocio = async (): Promise<LineaNegocio[]> => {
	const axiosResponse = await axiosClient.get('/lineas-negocio')
	const response: ObtenerLineasNegocioResponse = axiosResponse.data

	return response.lineas_negocio
}
