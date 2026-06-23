import { Suspense } from 'react'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import CardProspectos from '@/components/prospectos/card-prospectos/card-prospectos'
import { CardProspectosSkeleton } from '@/components/prospectos/card-prospectos/card-prospectos-skeleton'
const ProspectosPage = () => {
	return (
		<>
			<PanelLayout>
				<Suspense fallback={<CardProspectosSkeleton />}>
					<CardProspectos />
				</Suspense>
			</PanelLayout>
		</>
	)
}

export default ProspectosPage
