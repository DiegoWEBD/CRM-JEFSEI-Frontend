import {
	ObtenerNotificacionesResponse,
	NivelNotificacion,
} from '@/types/notificaciones/notificacion'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type UseNotificacionesParams = {
	no_leidas?: boolean
	nivel?: NivelNotificacion
	codigo_tipo?: string
	pagina?: number
	tamano_pagina?: number
	enabled?: boolean
}

export const useNotificaciones = (filtros: UseNotificacionesParams = {}) => {
	const {
		no_leidas,
		nivel,
		codigo_tipo,
		pagina = 1,
		tamano_pagina = 15,
	} = filtros

	return useQuery<ObtenerNotificacionesResponse>({
		queryKey: [
			'notificaciones',
			no_leidas,
			nivel,
			codigo_tipo,
			pagina,
			tamano_pagina,
		],
		queryFn: async () => {
			const params = new URLSearchParams()
			params.set('pagina', String(pagina))
			params.set('tamano_pagina', String(tamano_pagina))
			if (no_leidas !== undefined) params.set('no_leidas', String(no_leidas))
			if (nivel) params.set('nivel', nivel)
			if (codigo_tipo) params.set('codigo_tipo', codigo_tipo)

			const response = await axios.get(`/api/notificaciones?${params.toString()}`)
			return response.data as ObtenerNotificacionesResponse
		},
		enabled: filtros.enabled ?? true,
	})
}
