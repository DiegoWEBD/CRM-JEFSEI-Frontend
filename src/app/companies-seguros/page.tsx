import { Suspense } from 'react'
import { PanelInner } from './panel-inner'
import { CompaniesPageSkeleton } from './components/companies-page-skeleton'

export default function CompaniesSegurosPage() {
	return (
		<Suspense fallback={<CompaniesPageSkeleton />}>
			<PanelInner />
		</Suspense>
	)
}
