import { Suspense } from 'react'
import { PanelInner } from './panel-inner'
import { PanelSkeleton } from './panel-skeleton'

export default function ProcesosComercialesPage() {
	return (
		<Suspense fallback={<PanelSkeleton />}>
			<PanelInner />
		</Suspense>
	)
}
