import { Suspense } from 'react'
import { PerfilPageSkeleton } from './components/perfil-page-skeleton'
import { PanelInner } from './panel-inner'

export default function PerfilPage() {
	return (
		<Suspense fallback={<PerfilPageSkeleton />}>
			<PanelInner />
		</Suspense>
	)
}
