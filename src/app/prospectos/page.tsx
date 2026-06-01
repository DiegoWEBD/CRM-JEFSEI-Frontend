import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import CardProspectos from '@/components/prospectos/card-prospectos/card-prospectos'
import TituloPagina from '@/components/titulos/titulo-pagina'

const ProspectosPage = () => {
	return (
		<>
			<TituloPagina>Prospectos</TituloPagina>

			<PanelLayout>
				{/*<Suspense fallback={<CardProspectosSkeleton />}>
					<CardProspectos />
				</Suspense>*/}
				<CardProspectos />
			</PanelLayout>
		</>
	)
}

export default ProspectosPage
