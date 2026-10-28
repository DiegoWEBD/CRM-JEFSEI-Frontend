import axios from 'axios'
import { CambiarLineaNegocioProspectoRequest } from './dto/cambiar-linea-negocio-request'
import { CambiarLineaNegocioProspectoResponse } from './dto/cambiar-linea-negocio-response'

export const cambiarLineaNegocioProspecto = async (
	idProspecto: number,
	request: CambiarLineaNegocioProspectoRequest,
): Promise<CambiarLineaNegocioProspectoResponse> => {
	const response = await axios.patch(
		`/api/prospectos/${idProspecto}/linea-negocio`,
		request,
	)
	return response.data
}
