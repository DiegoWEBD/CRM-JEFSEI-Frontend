import { ObtenerRegistrosAuditoriaResponse } from '@/aplicacion/auditoria/dtos/obtener-registros-auditoria-response'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'

export type UseRegistrosAuditoriaParams = {
	initialData?: ObtenerRegistrosAuditoriaResponse
	categoria: string | null
	evento: string | null
	textoBusqueda: string
	fechaDesde: string | null
	fechaHasta: string | null
	ipOrigen: string
	pagina: number
	tamanoPagina?: number
}

export const useRegistrosAuditoria = ({
	initialData,
	categoria,
	evento,
	textoBusqueda,
	fechaDesde,
	fechaHasta,
	ipOrigen,
	pagina,
	tamanoPagina = 15,
}: UseRegistrosAuditoriaParams) => {
	const esConsultaInicial =
		categoria === 'AUTENTICACION' &&
		evento === null &&
		textoBusqueda === '' &&
		fechaDesde === null &&
		fechaHasta === null &&
		ipOrigen === '' &&
		pagina === 1 &&
		tamanoPagina === 15

	return useQuery({
		queryKey: [
			'auditoria',
			categoria,
			evento,
			textoBusqueda,
			fechaDesde,
			fechaHasta,
			ipOrigen,
			pagina,
			tamanoPagina,
		],
		queryFn: async () => {
			const params = new URLSearchParams()
			if (categoria) params.set('categoria', categoria)
			if (evento) params.set('evento', evento)
			if (textoBusqueda) params.set('texto_busqueda', textoBusqueda)
			if (fechaDesde) params.set('fecha_desde', fechaDesde)
			if (fechaHasta) params.set('fecha_hasta', fechaHasta)
			if (ipOrigen) params.set('ip_origen', ipOrigen)
			params.set('pagina', String(pagina))
			params.set('tamano_pagina', String(tamanoPagina))

			const response = await axios.get(`/api/auditoria?${params.toString()}`)
			return response.data as ObtenerRegistrosAuditoriaResponse
		},
		initialData: esConsultaInicial ? initialData : undefined,
		placeholderData: keepPreviousData,
	})
}
