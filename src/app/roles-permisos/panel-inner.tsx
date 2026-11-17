import { obtenerPermisos } from '@/aplicacion/permisos/use-cases/obtener-permisos'
import { obtenerRolesConPermisos } from '@/aplicacion/roles/use-cases/obtener-roles-con-permisos'
import PermissionGuard from '@/components/layouts/guards/permission-guard'
import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import RolesPermisosClient from './components/roles-permisos-client'

/**
 * Prefetch SSR de los catálogos del panel: roles con sus permisos y
 * permisos. Son datasets fijos, así que se traen completos y sin paginar.
 *
 * Las queryKeys deben calzar exactamente con las de `useRolesConPermisos`
 * y `usePermisos` para que la hidratación sea efectiva y no se dispare un
 * segundo fetch.
 */
export async function PanelInner() {
	const queryClient = new QueryClient()

	await queryClient.query({
		queryKey: ['roles-con-permisos'],
		queryFn: async () => (await obtenerRolesConPermisos()).data,
	})

	await queryClient.query({
		queryKey: ['permisos'],
		queryFn: async () => (await obtenerPermisos()).data,
	})

	return (
		<PermissionGuard allowedPermissions={['ADMINISTRAR_ROLES']}>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<RolesPermisosClient />
			</HydrationBoundary>
		</PermissionGuard>
	)
}
