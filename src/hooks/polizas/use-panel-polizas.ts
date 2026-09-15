import { PanelPolizasResponse } from '@/aplicacion/polizas/use_cases/dto/obtener_polizas_response'
import type { FiltroEstadoPoliza } from '@/components/paneles/polizas/kpi-polizas'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const ESTADO_A_BACKEND: Record<string, string> = {
	vigentes: 'VIGENTE',
	por_vencer: 'POR_VENCER',
	vencidas: 'VENCIDA',
	canceladas: 'CANCELADA',
	registradas: 'REGISTRADA',
}

export type FiltrosPanelPolizas = {
	id_cliente?: number | null
	id_company?: number | null
	id_producto?: number | null
	id_linea_negocio?: number | null
	texto_busqueda?: string | null
	estado?: FiltroEstadoPoliza
	pagina?: number
	tamano_pagina?: number
}

export const usePanelPolizas = (
	filtros: FiltrosPanelPolizas,
	options?: { enabled?: boolean },
) => {
	const {
		id_cliente,
		id_company,
		id_producto,
		id_linea_negocio,
		texto_busqueda,
		estado,
		pagina = 1,
		tamano_pagina = 20,
	} = filtros

	const estadoBackend =
		estado && estado !== 'todas' ? ESTADO_A_BACKEND[estado] : undefined

	return useQuery<PanelPolizasResponse>({
		queryKey: [
			'panel-polizas',
			id_cliente,
			id_company,
			id_producto,
			id_linea_negocio,
			texto_busqueda,
			estadoBackend,
			pagina,
			tamano_pagina,
		],
		queryFn: async () => {
			const params = new URLSearchParams()

			if (id_cliente != null) params.set('id_cliente', String(id_cliente))
			if (id_company != null) params.set('id_company', String(id_company))
			if (id_producto != null) params.set('id_producto', String(id_producto))
			if (id_linea_negocio != null)
				params.set('id_linea_negocio', String(id_linea_negocio))
			if (texto_busqueda) params.set('texto_busqueda', texto_busqueda)
			if (estadoBackend) params.set('estado', estadoBackend)
			params.set('pagina', String(pagina))
			params.set('tamano_pagina', String(tamano_pagina))

			const response = await axios.get(`/api/polizas?${params.toString()}`)
			return response.data as PanelPolizasResponse
		},
		placeholderData: prev => prev,
		enabled: options?.enabled ?? true,
	})
}
