import { ObtenerProspectosResponse } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/obtener-prospectos-response'
import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/obtener-prospectos'
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query'
import ProspectosPageClient from './components/prospectos-page-client/prospectos-page-client'

export async function ProspectosPageInner() {
	const queryClient = new QueryClient()

	await queryClient.query<ObtenerProspectosResponse>({
		queryKey: ['prospectos', null, '', 1, 10, null, null, null],
		queryFn: () => obtenerProspectos({ pagina: 1, tamanoPagina: 10 }),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProspectosPageClient />
		</HydrationBoundary>
	)
}
