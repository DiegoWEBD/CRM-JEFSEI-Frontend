import { CardProspectosSkeleton } from '@/components/prospectos/card-prospectos/card-prospectos-skeleton'
import { Suspense } from 'react'
import { ProspectosPageInner } from './prospectos-page-inner'

const ProspectosPage = () => {
	return (
		<Suspense fallback={<CardProspectosSkeleton />}>
			<ProspectosPageInner />
		</Suspense>
	)
}

export default ProspectosPage
