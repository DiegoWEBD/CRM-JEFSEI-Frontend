import AdministradorCondominio from '@/dominio/administrador-condominio/administrador-condominio'
import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerAdministradorPorIdResponse } from './dto/obtener-administrador-por-id-response'

export const obtenerAdministradorPorId = async (
	id: number,
): Promise<AdministradorCondominio> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get(`/administradores/${id}`, {
		headers: { Cookie: cookieStore.toString() },
	})

	const data: ObtenerAdministradorPorIdResponse = response.data

	return data.data
}
