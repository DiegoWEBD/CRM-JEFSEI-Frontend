import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerRecordatoriosResponse } from './dto/obtener-recordatorios-response'
import Recordatorio from '@/dominio/recordatorio/recordatorio'

type ObtenerRecordatoriosProps = {
	fecha: string
	id_prospecto: number | null
}

export const obtenerRecordatorios = async ({
	fecha,
	id_prospecto,
}: ObtenerRecordatoriosProps): Promise<Recordatorio[]> => {
	const cookieStore = await cookies()

	let endpoint = `/recordatorios?fecha=${fecha}`

	if (id_prospecto) endpoint = `${endpoint}&id_prospecto=${id_prospecto}`

	const response = await axiosClient.get(endpoint, {
		headers: {
			Cookie: cookieStore.toString(),
		},
	})
	const data: ObtenerRecordatoriosResponse = response.data

	return data.recordatorios
}
