import { obtenerProductos } from '@/aplicacion/producto/use-cases/obtener-productos'
import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import ProductosClient from './components/productos-client'

/**
 * Prefetch SSR de la consulta inicial: productos, página 1, sin filtros.
 *
 * La queryKey debe calzar exactamente con la de `useProductos` para que
 * la hidratación sea efectiva y no se dispare un segundo fetch.
 */
export async function PanelInner() {
	const queryClient = new QueryClient()

	await queryClient.query({
		queryKey: ['productos', null, '', 1, 10],
		queryFn: () => obtenerProductos({ pagina: 1, tamanoPagina: 10 }),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProductosClient />
		</HydrationBoundary>
	)
}
