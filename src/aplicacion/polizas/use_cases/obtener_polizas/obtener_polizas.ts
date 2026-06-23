import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerPolizasResponse } from '../dto/obtener_polizas_response'
import Poliza from '@/dominio/poliza/poliza'

export const obtenerPolizas = async (id_cliente: number): Promise<Poliza[]> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get(`/polizas?id_cliente=${id_cliente}`, {
		headers: {
			Cookie: cookieStore.toString(),
		},
	})

	const data: ObtenerPolizasResponse = response.data
	return data.polizas
}
