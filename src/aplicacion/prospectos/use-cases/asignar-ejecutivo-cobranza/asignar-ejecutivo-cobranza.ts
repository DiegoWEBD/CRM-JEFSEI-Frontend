import axios from 'axios'
import { AsignarEjecutivoCobranzaRequest } from './dto/asignar-ejecutivo-cobranza-request'

export const asignarEjecutivoCobranza = async (
	idCliente: number,
	request: AsignarEjecutivoCobranzaRequest,
) => {
	const response = await axios.post(
		`/api/clientes/${idCliente}/asignar-ej-cobranza`,
		request,
	)
	return response.data
}
