import axios from 'axios'
import { AsignarEjecutivoRenovacionRequest } from './dto/asignar-ejecutivo-renovacion-request'

export const asignarEjecutivoRenovacion = async (
	idCliente: number,
	request: AsignarEjecutivoRenovacionRequest,
) => {
	const response = await axios.post(
		`/api/clientes/${idCliente}/asignar-ej-renovacion`,
		request,
	)
	return response.data
}
