import { axiosClient } from '@/infraestructura/axios/axios-client'
import { ProspectoJson } from './dto/prospecto-json'
import { ObtenerProspectoResponse } from './dto/obtener-prospecto-response'

export const obtenerProspecto = async (
	id: number,
	cookie?: string,
): Promise<ProspectoJson> => {
	const axiosResponse = await axiosClient.get(`/prospectos/${id}`, {
		headers: {
			Cookie: cookie,
		},
	})

	const response: ObtenerProspectoResponse = axiosResponse.data

	return response.prospecto
}
