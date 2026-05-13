import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/obtener-prospectos'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import CardProspectos from '@/components/prospectos/card-prospectos/card-prospectos'
import TituloPagina from '@/components/titulos/titulo-pagina'
import ComponenteRegistrarProspecto from './components/componente-registrar-prospecto/componente-registrar-prospecto'
import { cookies } from 'next/headers'

const ProspectosPage = async () => {
	const cookieStore = await cookies()
	const prospectos = await obtenerProspectos({
		cookie: cookieStore.toString(),
	})

	return (
		<>
			<TituloPagina>Prospectos</TituloPagina>

			<PanelLayout>
				<ComponenteRegistrarProspecto />
				<CardProspectos prospectos={prospectos} />
			</PanelLayout>
		</>
	)
}

export default ProspectosPage
