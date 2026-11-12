import { obtenerTodasSolicitudesCotizacion } from '@/aplicacion/solicitudes-cotizacion/use-cases/obtener-todas-solicitudes-cotizacion/obtener-todas-solicitudes-cotizacion'
import {
	filtrosIniciales,
	queryKeySolicitudesPanel,
} from '@/hooks/solicitudes-cotizacion/query-key-solicitudes-panel'
import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import PanelSolicitudesEstudioClient from './panel-solicitudes-estudio-client'

/**
 * Prefetch SSR de la consulta inicial del panel: página 1 sin búsqueda, con
 * tamaño de página 15.
 *
 * La queryKey se construye con el mismo `queryKeySolicitudesPanel` y los
 * mismos `filtrosIniciales` que usa el hook en el cliente, para que la
 * hidratación sea efectiva y no se dispare un segundo fetch.
 *
 * No se leen `searchParams` de la URL a propósito: el panel arranca siempre en
 * la primera página y la búsqueda/paginación vive en el estado cliente.
 */
export async function PanelSolicitudesEstudioInner() {
	const queryClient = new QueryClient()

	const initialData = await queryClient.fetchQuery({
		queryKey: queryKeySolicitudesPanel(filtrosIniciales()),
		queryFn: () => obtenerTodasSolicitudesCotizacion(),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PanelSolicitudesEstudioClient initialData={initialData} />
		</HydrationBoundary>
	)
}
