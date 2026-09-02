import { Suspense } from 'react'
import { PanelInner } from './panel-inner'
import { PanelSkeleton } from './panel-skeleton'

export default function CotizacionesEstudiosPage() {
	return (
		<Suspense fallback={<PanelSkeleton />}>
			<PanelInner />
		</Suspense>
	)
}
