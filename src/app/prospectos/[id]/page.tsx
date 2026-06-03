import { obtenerProspecto } from '@/aplicacion/prospectos/use-cases/obtener-prospecto/obtener-prospecto'
import PanelHeader from '@/components/paneles/panel-layout/panel-header/panel-header'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import { cookies } from 'next/headers'
import CardInformacionProspecto from './components/card-informacion-prospecto/card-informacion-prospecto'
import PaginaProspectoHeader from './components/pagina-prospecto-header/pagina-prospecto-header'

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

			<CardInformacionProspecto prospecto={prospecto} />
		</PanelLayout>
	)
}
