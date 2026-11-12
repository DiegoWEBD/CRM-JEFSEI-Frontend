import { ObtenerTodasSolicitudesCotizacionResponse } from '@/aplicacion/solicitudes-cotizacion/use-cases/obtener-todas-solicitudes-cotizacion/dto/obtener-todas-solicitudes-cotizacion-response'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {
	esConsultaInicial as esConsultaInicialFiltros,
	queryKeySolicitudesPanel,
	type FiltrosSolicitudesCotizacion,
} from './query-key-solicitudes-panel'

export type { FiltrosSolicitudesCotizacion }

export const useObtenerTodasSolicitudesCotizacion = (
	filtros: FiltrosSolicitudesCotizacion,
	initialData?: ObtenerTodasSolicitudesCotizacionResponse,
) => {
	return useQuery<ObtenerTodasSolicitudesCotizacionResponse>({
		queryKey: queryKeySolicitudesPanel(filtros),
		queryFn: async () => {
			const params = new URLSearchParams()
			if (filtros.textoBusqueda) params.set('texto_busqueda', filtros.textoBusqueda)
			if (filtros.estado) params.set('estado', filtros.estado)
			if (filtros.prioridad) params.set('prioridad', filtros.prioridad)
			if (filtros.rutUsuario) params.set('rut_usuario', filtros.rutUsuario)
			params.set('pagina', String(filtros.pagina))
			params.set('tamano_pagina', String(filtros.tamanoPagina))

			const response = await axios.get<ObtenerTodasSolicitudesCotizacionResponse>(
				`/api/solicitudes-cotizacion?${params.toString()}`,
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
