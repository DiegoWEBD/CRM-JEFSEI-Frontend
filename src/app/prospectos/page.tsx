import { Suspense } from 'react'

import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import PanelProspectos from '@/components/prospectos/panel-prospectos/panel-prospectos'
import { PanelProspectosSkeleton } from '@/components/prospectos/panel-prospectos/panel-prospectos-skeleton'

const ProspectosPage = () => {
	return (
		<PanelLayout>
			<Suspense fallback={<PanelProspectosSkeleton />}>
				<PanelProspectos />
			</Suspense>
		</PanelLayout>
	)
}

export default ProspectosPage
