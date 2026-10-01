import { Suspense } from 'react'
import { AuditoriaPageSkeleton } from './components/auditoria-page-skeleton'
import { PanelInner } from './panel-inner'

export default function AuditoriaPage() {
	return (
		<Suspense fallback={<AuditoriaPageSkeleton />}>
			<PanelInner />
		</Suspense>
	)
}
