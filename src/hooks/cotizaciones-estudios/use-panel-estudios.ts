import { ObtenerPanelEstudiosResponse } from '@/aplicacion/cotizaciones-estudios/dto/obtener-panel-estudios-response'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {
	esConsultaInicial as esConsultaInicialFiltros,
	queryKeyPanelEstudios,
	type FiltrosPanelEstudios,
} from './query-key-panel-estudios'

export type { FiltrosPanelEstudios }

export const usePanelEstudios = (
	filtros: FiltrosPanelEstudios,
	initialData?: ObtenerPanelEstudiosResponse,
) => {
	return useQuery<ObtenerPanelEstudiosResponse>({
		queryKey: queryKeyPanelEstudios(filtros),
		queryFn: async () => {
			const params = new URLSearchParams()
			if (filtros.textoBusqueda) params.set('texto_busqueda', filtros.textoBusqueda)
			if (filtros.estado) params.set('estado', filtros.estado)
			if (filtros.prioridad) params.set('prioridad', filtros.prioridad)
			if (filtros.rutEjecutivo) params.set('rut_ejecutivo', filtros.rutEjecutivo)
			params.set('pagina', String(filtros.pagina))
			params.set('tamano_pagina', String(filtros.tamanoPagina))

			const response = await axios.get<ObtenerPanelEstudiosResponse>(
				`/api/estudio-comercial/panel?${params.toString()}`,
			)
			return response.data
		},
		initialData: esConsultaInicialFiltros(filtros) ? initialData : undefined,
		placeholderData: keepPreviousData,
		// Los datos del prefetch SSR deben sobrevivir el montaje sin un segundo
		// fetch: con staleTime 0 la query hidratada se considera obsoleta al
		// instante y se volvería a consultar. Las invalidaciones por mutaciones
		// siguen forzando el refetch.
		staleTime: 30_000,
	})
}
