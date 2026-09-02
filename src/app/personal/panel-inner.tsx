import { obtenerUsuarios } from '@/aplicacion/usuarios/use-cases/obtener-usuarios'
import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import PersonalClient from './components/personal-client'

export async function PanelInner() {
	const queryClient = new QueryClient()

	await queryClient.query({
		queryKey: ['usuarios', '', 1, 15],
		queryFn: () =>
			obtenerUsuarios({ textoBusqueda: '', pagina: 1, tamanoPagina: 15 }),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PersonalClient />
		</HydrationBoundary>
	)
}
