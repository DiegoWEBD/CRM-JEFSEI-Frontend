import { axiosClient } from '@/infraestructura/axios/axios-client'
import Contacto from '@/dominio/contacto/contacto'
import { cookies } from 'next/headers'
import { ObtenerContactosResponse } from './dto/obtener-contactos-response'

export const obtenerContactos = async (
	idProspecto: number,
): Promise<Contacto[]> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get(
		`/prospectos/${idProspecto}/contactos`,
		{
			headers: { Cookie: cookieStore.toString() },
		},
	)

	const data: ObtenerContactosResponse = response.data

	return data.data
}
