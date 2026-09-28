import { obtenerCompaniesSeguros } from '@/aplicacion/companies-seguros/use-cases/obtener-companies-seguros'
import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import CompaniesClient from './components/companies-client'

/**
 * Prefetch SSR de la consulta inicial del panel: página 1 sin búsqueda,
 * con tamaño de página 10.
 *
 * Estos valores (orden, tipo y valor) deben calzar exactamente con la
 * queryKey de `useCompaniesSegurosPaginado` para que la hidratación sea
 * efectiva y no se dispare un segundo fetch en el cliente.
 *
 * No se leen `searchParams` de la URL a propósito: el panel arranca siempre
 * en la primera página y la búsqueda/paginación vive en el estado cliente.
 */
export async function PanelInner() {
	const queryClient = new QueryClient()

	const initialData = await queryClient.fetchQuery({
		queryKey: ['companies-seguros', '', 1, 10],
		queryFn: () =>
			obtenerCompaniesSeguros({ textoBusqueda: '', pagina: 1, tamanoPagina: 10 }),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CompaniesClient initialData={initialData} />
		</HydrationBoundary>
	)
}
