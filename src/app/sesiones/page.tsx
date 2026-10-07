import { Suspense } from 'react'
import { SesionesPageSkeleton } from './components/sesiones-page-skeleton'
import { PanelInner } from './panel-inner'

export default function SesionesPage() {
	return (
		<Suspense fallback={<SesionesPageSkeleton />}>
			<PanelInner />
		</Suspense>
	)
}