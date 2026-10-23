import axios from 'axios'
import { GenerarDesgloseUnidadesRequest } from './dto/generar-desglose-unidades-request'

export const generarDesgloseUnidades = async (
	request: GenerarDesgloseUnidadesRequest,
): Promise<Blob> => {
	const response = await axios.post(
		'/api/estudio-comercial/unidades/desglose-excel',
		request,
		{ responseType: 'blob' },
	)
	return response.data
}
