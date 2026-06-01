import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { ObtenerProspectoResponse } from './dto/obtener-prospecto-response'

export const obtenerProspecto = async (
	id: number,
	cookie?: string,
): Promise<ProspectoCondominio> => {
	const response = await axiosClient.get(`/prospectos/${id}`, {
		headers: {
			Cookie: cookie,
		},
	})

	const data: ObtenerProspectoResponse = response.data

	return data.prospecto
}
