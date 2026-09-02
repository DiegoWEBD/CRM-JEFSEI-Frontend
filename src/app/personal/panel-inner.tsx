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
		queryKey: ['usuarios', undefined, 1, 7],
		queryFn: () => obtenerUsuarios({ pagina: 1, tamanoPagina: 7 }),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PersonalClient />
		</HydrationBoundary>
	)
}
