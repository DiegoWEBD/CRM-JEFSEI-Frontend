import Calendario from '@/components/calendario/calendario'
import Card from '@/components/card/card'
import PanelInformativo from '@/components/panel-central/panel-informativo/panel-informativo'
import ProgresoMeta from '@/components/panel-central/progreso-meta'
import Titulo from '@/components/titulos/titulo'
import PanelLayout from '../panel-layout/panel-layout'
import PanelHeader from '../panel-layout/panel-header/panel-header'
import PanelBody from '../panel-layout/panel-body/panel-body'

const PanelEjecutivoComercial = () => {
	return (
		<>
			<Titulo>Panel central</Titulo>
			<PanelLayout>
				<PanelHeader>
					<ProgresoMeta className='w-full lg:max-w-sm p-4' />
				</PanelHeader>

				<PanelBody>
					<Calendario className='lg:col-span-3' />

					<div className='space-y-6'>
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
					</div>
				</PanelBody>
			</PanelLayout>
		</>
	)
}

export default PanelEjecutivoComercial
