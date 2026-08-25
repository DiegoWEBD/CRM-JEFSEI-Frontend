import PermissionGuard from '@/components/layouts/guards/permission-guard'
import { Suspense } from 'react'
import { PanelInner } from './panel-inner'
import { PanelSkeleton } from './panel-skeleton'

export default function ProcesosComercialesPage() {
	return (
		<PermissionGuard allowedPermissions={['ADMINISTRAR_PROCESOS_COMERCIALES']}>
			<Suspense fallback={<PanelSkeleton />}>
				<PanelInner />
			</Suspense>
		</PermissionGuard>
	)
}
