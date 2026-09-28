import { axiosClient } from '@/infraestructura/axios/axios-client'
import { cookies } from 'next/headers'
import {
	ObtenerNotificacionesResponse,
	NivelNotificacion,
} from '@/types/notificaciones/notificacion'

type ObtenerNotificacionesProps = {
	no_leidas?: boolean
	nivel?: NivelNotificacion
	codigo_tipo?: string
	pagina?: number
	tamano_pagina?: number
}

export const obtenerNotificaciones = async ({
	no_leidas,
	nivel,
	codigo_tipo,
	pagina = 1,
	tamano_pagina = 15,
}: ObtenerNotificacionesProps): Promise<ObtenerNotificacionesResponse> => {
	const cookieStore = await cookies()

	const params = new URLSearchParams()
	params.set('pagina', String(pagina))
	params.set('tamano_pagina', String(tamano_pagina))
	if (no_leidas !== undefined) params.set('no_leidas', String(no_leidas))
	if (nivel) params.set('nivel', nivel)
	if (codigo_tipo) params.set('codigo_tipo', codigo_tipo)

	const response = await axiosClient.get(`/notificaciones/?${params.toString()}`, {
		headers: { Cookie: cookieStore.toString() },
	})

	return response.data
}
