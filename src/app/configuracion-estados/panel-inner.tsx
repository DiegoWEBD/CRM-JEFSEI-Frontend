import PermissionGuard from '@/components/layouts/guards/permission-guard'
import { obtenerEstadosConfiguracion } from '@/aplicacion/estados-admin/use-cases/obtener-estados-configuracion'
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from '@tanstack/react-query'
import ConfiguracionEstadosClient from './components/configuracion-estados-client'

/**
 * Prefetch SSR de la configuración de estados.
 *
 * Es un dataset fijo, así que se trae completo y sin paginar: la búsqueda y
 * el filtrado viven en el estado del cliente. La queryKey debe calzar
 * exactamente con la de `useEstadosConfiguracion`.
 */
export async function ConfiguracionEstadosPanelInner() {
	const queryClient = new QueryClient()

	await queryClient.fetchQuery({
		queryKey: ['estados-configuracion'],
		queryFn: () => obtenerEstadosConfiguracion(),
	})

	return (
		<PermissionGuard allowedPermissions={['ADMINISTRAR_ESTADOS_PROCESO_COMERCIAL']}>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<ConfiguracionEstadosClient />
			</HydrationBoundary>
		</PermissionGuard>
	)
}
