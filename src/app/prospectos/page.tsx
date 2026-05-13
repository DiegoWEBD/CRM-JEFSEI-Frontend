import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import CardProspectos from '@/components/prospectos/card-prospectos/card-prospectos'
import CardProspectosSkeleton from '@/components/prospectos/card-prospectos/card-prospectos-skeleton'
import TituloPagina from '@/components/titulos/titulo-pagina'
import { Suspense } from 'react'
import ComponenteRegistrarProspecto from './components/componente-registrar-prospecto/componente-registrar-prospecto'

const ProspectosPage = () => {
	return (
		<>
			<TituloPagina>Prospectos</TituloPagina>

			<PanelLayout>
				<ComponenteRegistrarProspecto />
				<Suspense fallback={<CardProspectosSkeleton />}>
					<CardProspectos />
				</Suspense>
			</PanelLayout>
		</>
	)
}

export default ProspectosPage
