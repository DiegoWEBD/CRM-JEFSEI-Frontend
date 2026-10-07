import { ObtenerSesionesResponse } from '@/aplicacion/sesiones/dtos/obtener-sesiones-response'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'

type UseSesionesParams = {
	textoBusqueda: string
	rutUsuario: string | null
	estado: string | null
	pagina: number
	tamanoPagina?: number
}

/**
 * Listado paginado de sesiones para el panel de administración.
 *
 * La queryKey debe calzar exactamente con el prefetch del servidor
 * (`panel-inner.tsx`): mismo orden, mismos tipos y mismos valores
 * (`''` no `undefined`, `null` no `'null'`), o la hidratación no se
 * aprovecharía y se dispararía un segundo fetch.
 */
export const useSesiones = ({
	textoBusqueda,
	rutUsuario,
	estado,
	pagina,
	tamanoPagina = 15,
}: UseSesionesParams) => {
	return useQuery<ObtenerSesionesResponse>({
		queryKey: [
			'sesiones',
			textoBusqueda,
			rutUsuario,
			estado,
			pagina,
			tamanoPagina,
		],
		queryFn: async () => {
			const params = new URLSearchParams()
			if (textoBusqueda) params.set('texto_busqueda', textoBusqueda)
			if (rutUsuario) params.set('rut_usuario', rutUsuario)
			if (estado) params.set('estado', estado)
			params.set('pagina', String(pagina))
			params.set('tamano_pagina', String(tamanoPagina))

			const response = await axios.get<ObtenerSesionesResponse>(
				`/api/sesiones?${params.toString()}`,
			)
			return response.data
		},
		placeholderData: keepPreviousData,
	})
}