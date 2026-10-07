import { obtenerSesiones } from '@/aplicacion/sesiones/use-cases/obtener-sesiones'
import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import SesionesClient from './components/sesiones-client'

/**
 * Prefetch SSR de la consulta inicial: sesiones activas, página 1.
 *
 * La queryKey debe calzar exactamente con la de `useSesiones` para que
 * la hidratación sea efectiva y no se dispare un segundo fetch.
 */
export async function PanelInner() {
	const queryClient = new QueryClient()

	await queryClient.query({
		queryKey: ['sesiones', '', null, 'activas', 1, 15],
		queryFn: () =>
			obtenerSesiones({
				textoBusqueda: '',
				rutUsuario: null,
				estado: 'activas',
				pagina: 1,
				tamanoPagina: 15,
			}),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<SesionesClient />
		</HydrationBoundary>
	)
}