import { Suspense } from 'react'
import { RolesPermisosPageSkeleton } from './components/roles-permisos-page-skeleton'
import { PanelInner } from './panel-inner'

export default function RolesPermisosPage() {
	return (
		<Suspense fallback={<RolesPermisosPageSkeleton />}>
			<PanelInner />
		</Suspense>
	)
}
