import { Suspense } from 'react'
import { PanelInner } from './panel-inner'
import { PersonalPageSkeleton } from './components/personal-page-skeleton'

export default function PersonalPage() {
	return (
		<Suspense fallback={<PersonalPageSkeleton />}>
			<PanelInner />
		</Suspense>
	)
}
