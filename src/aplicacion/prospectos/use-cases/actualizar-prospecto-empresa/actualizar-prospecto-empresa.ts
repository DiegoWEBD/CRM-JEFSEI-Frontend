import axios from 'axios'
import { ActualizarProspectoEmpresaRequest } from './dto/requests/actualizar-prospecto-empresa-request'

export const actualizarProspectoEmpresa = async (
	request: ActualizarProspectoEmpresaRequest,
	idProspecto: number,
) => {
	await axios.put(`/api/prospectos/empresas/${idProspecto}`, request)
}
