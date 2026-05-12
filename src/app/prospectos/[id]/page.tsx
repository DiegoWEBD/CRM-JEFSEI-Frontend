import { obtenerProspecto } from '@/aplicacion/prospectos/use-cases/obtener-prospecto/obtener-prospecto'
import PanelHeader from '@/components/paneles/panel-layout/panel-header/panel-header'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import { cookies } from 'next/headers'
import PaginaProspectoHeader from './components/pagina-prospecto-header/pagina-prospecto-header'
import PanelBody from '@/components/paneles/panel-layout/panel-body/panel-body'
import PanelBodyMainContent from '@/components/paneles/panel-layout/panel-body/panel-body-main-content/panel-body-main-content'
import PanelBodySidebar from '@/components/paneles/panel-layout/panel-body/panel-body-sidebar/panel-body-sidebar'
import InformacionProspecto from './components/informacion-prospecto/informacion-prospecto'
import HistorialInteracciones from './components/historial-interacciones/historial-interacciones'

type ProspectoPageProps = {
	params: Promise<{
		id: string
	}>
}

export default async function ProspectoPage({ params }: ProspectoPageProps) {
	const { id } = await params

	const cookieStore = await cookies()
	const cookieHeader = cookieStore.toString()

	const prospecto = await obtenerProspecto(Number(id), cookieHeader)

	return (
		<PanelLayout>
			<PanelHeader>
				<PaginaProspectoHeader prospecto={prospecto} />
			</PanelHeader>

			<PanelBody>
				<PanelBodyMainContent>
					<InformacionProspecto prospecto={prospecto} />
					<HistorialInteracciones
						historialEstados={prospecto.historial_estados}
					/>
				</PanelBodyMainContent>

				<PanelBodySidebar>
					<p>sidebar</p>
				</PanelBodySidebar>
			</PanelBody>
		</PanelLayout>
	)
}
