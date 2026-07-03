import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerPolizaResponse } from '../dto/obtener_poliza_response'

export const obtenerPoliza = async (numeroPoliza: string): Promise<ObtenerPolizaResponse> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get(`/polizas/${numeroPoliza}`, {
		headers: {
			Cookie: cookieStore.toString(),
		},
	})

	const data: ObtenerPolizaResponse = response.data
	return data
}
