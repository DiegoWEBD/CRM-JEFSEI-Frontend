import { axiosClient } from '@/infraestructura/axios/axios-client'
import { RegistrarProspectoRequest } from './dto/registrar-prospecto-request'

export const registrarProspecto = async (
	request: RegistrarProspectoRequest,
) => {
	await axiosClient.post('/prospectos', {
		...request,
	})
}
