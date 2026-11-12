import { obtenerPanelEstudios } from '@/aplicacion/cotizaciones-estudios/use-cases/obtener-panel-estudios/obtener-panel-estudios'
import {
	filtrosIniciales,
	queryKeyPanelEstudios,
} from '@/hooks/cotizaciones-estudios/query-key-panel-estudios'
import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import PanelCotizacionesEstudiosClient from '@/components/paneles/cotizaciones-estudios-emitidos/panel-cotizaciones-estudios-client'

/**
 * Prefetch SSR de la consulta inicial del panel: página 1 sin búsqueda, con
 * tamaño de página 10.
 *
 * La queryKey se construye con el mismo `queryKeyPanelEstudios` y los mismos
 * `filtrosIniciales` que usa el hook en el cliente, para que la hidratación
 * sea efectiva y no se dispare un segundo fetch.
 *
 * No se leen `searchParams` de la URL a propósito: el panel arranca siempre en
 * la primera página y la búsqueda/paginación vive en el estado cliente.
 */
export async function PanelInner() {
	const queryClient = new QueryClient()

	const initialData = await queryClient.fetchQuery({
		queryKey: queryKeyPanelEstudios(filtrosIniciales()),
		queryFn: () => obtenerPanelEstudios(),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PanelCotizacionesEstudiosClient initialData={initialData} />
		</HydrationBoundary>
	)
}
