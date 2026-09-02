import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import { ObtenerRecordatoriosResponse } from './dto/obtener-recordatorios-response'

type ObtenerRecordatoriosProps = {
	fecha: string
	id_prospecto: number | null
	pagina: number
	tamano_pagina: number
}

export const obtenerRecordatorios = async ({
	fecha,
	id_prospecto,
	pagina,
	tamano_pagina,
}: ObtenerRecordatoriosProps): Promise<ObtenerRecordatoriosResponse> => {
	const cookieStore = await cookies()

	let endpoint = `/recordatorios?fecha=${fecha}&pagina=${pagina}&tamano_pagina=${tamano_pagina}`

	if (id_prospecto) endpoint = `${endpoint}&id_prospecto=${id_prospecto}`

	const response = await axiosClient.get(endpoint, {
		headers: {
			Cookie: cookieStore.toString(),
		},
	})

	return response.data
}
