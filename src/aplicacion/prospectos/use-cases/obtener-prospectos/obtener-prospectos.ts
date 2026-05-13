import { axiosClient } from '@/infraestructura/axios/axios-client'
import { ObtenerProspectosResponse } from './dto/obtener-prospectos-response'
import ProspectoResumenJson from './dto/prospecto-resumen-json'

type ObtenerProspectosProps = {
	rutUsuario?: string
	cookie?: string
}

export const obtenerProspectos = async ({
	rutUsuario,
	cookie,
}: ObtenerProspectosProps): Promise<ProspectoResumenJson[]> => {
	let endpoint = '/prospectos'

	if (rutUsuario) {
		endpoint = `${endpoint}?rut_usuario=${rutUsuario}`
	}

	const axiosResponse = await axiosClient.get(endpoint, {
		headers: {
			Cookie: cookie,
		},
	})
	const response: ObtenerProspectosResponse = axiosResponse.data
	return response.data
}
