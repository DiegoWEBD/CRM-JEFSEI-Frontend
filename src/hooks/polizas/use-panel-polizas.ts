import { PanelPolizasResponse } from '@/aplicacion/polizas/use_cases/dto/obtener_polizas_response'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export type FiltrosPanelPolizas = {
	id_company?: number | null
	id_producto?: number | null
	id_linea_negocio?: number | null
	texto_busqueda?: string | null
	estado?: string | null
	pagina?: number
	tamano_pagina?: number
}

export const usePanelPolizas = (filtros: FiltrosPanelPolizas) => {
	const {
		id_company,
		id_producto,
		id_linea_negocio,
		texto_busqueda,
		estado,
		pagina = 1,
		tamano_pagina = 20,
	} = filtros

	return useQuery<PanelPolizasResponse>({
		queryKey: [
			'panel-polizas',
			id_company,
			id_producto,
			id_linea_negocio,
			texto_busqueda,
			estado,
			pagina,
			tamano_pagina,
		],
		queryFn: async () => {
			const params = new URLSearchParams()

			if (id_company != null) params.set('id_company', String(id_company))
			if (id_producto != null) params.set('id_producto', String(id_producto))
			if (id_linea_negocio != null)
				params.set('id_linea_negocio', String(id_linea_negocio))
			if (texto_busqueda) params.set('texto_busqueda', texto_busqueda)
			if (estado) params.set('estado', estado)
			params.set('pagina', String(pagina))
			params.set('tamano_pagina', String(tamano_pagina))

			const response = await axios.get(`/api/polizas?${params.toString()}`)
			return response.data as PanelPolizasResponse
		},
		placeholderData: prev => prev,
	})
}
