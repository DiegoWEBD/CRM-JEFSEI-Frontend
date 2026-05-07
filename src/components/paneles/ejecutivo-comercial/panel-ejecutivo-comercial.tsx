import Calendario from '@/components/calendario/calendario'
import Card from '@/components/card/card'
import PanelInformativo from '@/components/panel-central/panel-informativo/panel-informativo'
import ProgresoMeta from '@/components/panel-central/progreso-meta'
import Titulo from '@/components/titulos/titulo'
import PanelLayout from '../panel-layout/panel-layout'
import PanelHeader from '../panel-layout/panel-header/panel-header'
import PanelBody from '../panel-layout/panel-body/panel-body'
import ProspectosAsignados from './cards/prospectos-asignados/prospectos-asignados'
import PanelFooter from '../panel-layout/panel-footer/panel-footer'
import PanelBodyMainContent from '../panel-layout/panel-body/panel-body-main-content/panel-body-main-content'
import PanelBodySidebar from '../panel-layout/panel-body/panel-body-sidebar/panel-body-sidebar'

const PanelEjecutivoComercial = () => {
	return (
		<>
			<Titulo>Panel central</Titulo>
			<PanelLayout>
				<PanelHeader>
					<ProgresoMeta className='w-full lg:max-w-sm' />
				</PanelHeader>

				<PanelBody>
					<PanelBodyMainContent>
						<Calendario />
					</PanelBodyMainContent>

					<PanelBodySidebar>
						<Card className='space-y-4'>
							<div>
								<h2 className='font-semibold text-primary-highlight mb-2'>
									Notificaciones
								</h2>
								<ul className='text-gray-700 list-disc ml-4'>
									<li>Checklist de clientes a visitar</li>
									<li>Marcar para orden diario</li>
								</ul>
							</div>

							<div>
								<h2 className='font-semibold text-primary-highlight mb-2'>
									Tipos de aviso
								</h2>
								<ul className='text-gray-700 list-disc ml-4 space-y-1'>
									<li>Asignación de clientes</li>
									<li>Posible renovación externa</li>
									<li>Clientes a contactar</li>
									<li>Recordatorio reuniones</li>
								</ul>
							</div>
						</Card>
						<PanelInformativo />
					</PanelBodySidebar>
				</PanelBody>
				<PanelFooter>
					<ProspectosAsignados />
				</PanelFooter>
			</PanelLayout>
		</>
	)
}

export default PanelEjecutivoComercial
