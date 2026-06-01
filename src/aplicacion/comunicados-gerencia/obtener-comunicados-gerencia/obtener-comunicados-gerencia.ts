import ComunicadoGerencia from '@/dominio/comunicado-gerencia/comunicado-gerencia'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { ObtenerComunicadosGerenciaResponse } from './dto/obtener-comunicados-gerencia-response'

export const obtenerComunicadosGerencia = async (
	cookie: string,
): Promise<ComunicadoGerencia[]> => {
	const response = await axiosClient.get('/comunicados-gerencia', {
		headers: {
			Cookie: cookie,
		},
	})

	const data: ObtenerComunicadosGerenciaResponse = response.data
	return data.comunicados
}
