import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerProspectosResponse } from './dto/obtener-prospectos-response'
import { ProspectoResumenJson } from './dto/prospecto-resumen-json'

export const obtenerProspectos = async (): Promise<ProspectoResumenJson[]> => {
	const cookieStore = await cookies()

	const response = await axiosClient.get('/prospectos', {
		headers: { Cookie: cookieStore.toString() },
	})

	const data: ObtenerProspectosResponse = response.data

	return data.data
}
