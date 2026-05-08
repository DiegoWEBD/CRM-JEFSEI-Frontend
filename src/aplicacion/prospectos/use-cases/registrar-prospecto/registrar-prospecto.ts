import { axiosClient } from '@/infraestructura/axios/axios-client'
import { RegistrarProspectoRequest } from './dto/registrar-prospecto-request'

export const registrarProspecto = async (
	request: RegistrarProspectoRequest,
) => {
	console.log('registrando prospecto')
	const response = await axiosClient.post('/prospectos', {
		...request,
	})

	console.log(response.data)
}
