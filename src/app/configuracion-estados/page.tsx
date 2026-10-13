import { Suspense } from 'react'
import ConfiguracionEstadosSkeleton from './components/configuracion-estados-skeleton'
import { ConfiguracionEstadosPanelInner } from './panel-inner'

export default function ConfiguracionEstadosPage() {
	return (
		<Suspense fallback={<ConfiguracionEstadosSkeleton />}>
			<ConfiguracionEstadosPanelInner />
		</Suspense>
	)
}
