import { ObtenerProductosResponse } from '@/aplicacion/producto/dtos/obtener-productos-response'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'

/**
 * Listado paginado de productos.
 *
 * La queryKey debe calzar exactamente con el prefetch del servidor
 * (`panel-inner.tsx`): mismo orden, mismos tipos y mismos valores
 * (`''` no `undefined`, `null` no `'null'`), o la hidratación no se
 * aprovecharía y se dispararía un segundo fetch.
 *
 * `staleTime` evita que la consulta ya hidratada por el servidor se
 * refetchee al montar; las mutaciones siguen refrescando la tabla vía
 * `invalidateQueries(['productos'])`.
 */
export const useProductos = (
	idLineaNegocio: number | null,
	textoBusqueda: string,
	pagina: number,
	tamanoPagina: number,
) => {
	return useQuery({
		queryKey: [
			'productos',
			idLineaNegocio,
			textoBusqueda,
			pagina,
			tamanoPagina,
		],
		queryFn: async () => {
			const params = new URLSearchParams()
			if (idLineaNegocio) params.set('id_linea_negocio', String(idLineaNegocio))
			if (textoBusqueda) params.set('texto_busqueda', textoBusqueda)
			params.set('pagina', String(pagina))
			params.set('tamano_pagina', String(tamanoPagina))
			const response = await axios.get(`/api/productos?${params.toString()}`)
			return response.data as ObtenerProductosResponse
		},
		staleTime: 30_000,
		placeholderData: keepPreviousData,
	})
}
