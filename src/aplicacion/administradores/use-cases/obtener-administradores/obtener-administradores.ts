import { axiosClient } from '@/infraestructura/axios/axios-client'
import AdministradorCondominio from '@/dominio/administrador-condominio/administrador-condominio'
import { cookies } from 'next/headers'
import { ObtenerAdministradoresResponse } from './dto/obtener-administradores-response'

export const obtenerAdministradores = async (): Promise<
	AdministradorCondominio[]
> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get('/administradores', {
		headers: { Cookie: cookieStore.toString() },
	})

	const data: ObtenerAdministradoresResponse = response.data

	return data.data
}
