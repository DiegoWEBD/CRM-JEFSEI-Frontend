import { obtenerUsuarioPorRut } from '@/aplicacion/usuarios/use-cases/obtener-usuario-por-rut'
import { getSession } from '@/lib/auth'
import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import { cookies } from 'next/headers'
import PerfilClient from './components/perfil-client'

/**
 * Prefetch SSR del perfil propio: el rut sale de la sesión del contexto.
 *
 * La queryKey debe calzar exactamente con la de `useUsuario` para que
 * la hidratación sea efectiva y no se dispare un segundo fetch.
 */
export async function PanelInner() {
	const sesion = await getSession()
	const rut = sesion?.rut ?? ''
	const queryClient = new QueryClient()

	if (rut) {
		const cookieStore = await cookies()
		await queryClient.prefetchQuery({
			queryKey: ['usuario', rut],
			queryFn: () => obtenerUsuarioPorRut(rut, cookieStore.toString()),
		})
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PerfilClient rut={rut} />
		</HydrationBoundary>
	)
}
