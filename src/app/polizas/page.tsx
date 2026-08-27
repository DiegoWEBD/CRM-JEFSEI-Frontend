import PermissionGuard from '@/components/layouts/guards/permission-guard'
import { Suspense } from 'react'
import { PanelInner } from './panel-inner'
import { SkeletonPanelPolizas } from '@/components/paneles/polizas/skeleton-panel-polizas'

export default function PolizasPage() {
	return (
		<PermissionGuard allowedPermissions={['OBTENER_POLIZAS_TODAS', 'OBTENER_POLIZAS_PROPIAS']}>
			<Suspense fallback={<SkeletonPanelPolizas />}>
				<PanelInner />
			</Suspense>
		</PermissionGuard>
	)
}
