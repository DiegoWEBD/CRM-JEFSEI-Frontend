import { obtenerProspecto } from '@/aplicacion/prospectos/use-cases/obtener-prospecto/obtener-prospecto'
import PanelHeader from '@/components/paneles/panel-layout/panel-header/panel-header'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import { cookies } from 'next/headers'
import PaginaProspectoHeader from './components/pagina-prospecto-header/pagina-prospecto-header'
import PanelBody from '@/components/paneles/panel-layout/panel-body/panel-body'
import PanelBodyMainContent from '@/components/paneles/panel-layout/panel-body/panel-body-main-content/panel-body-main-content'
import PanelBodySidebar from '@/components/paneles/panel-layout/panel-body/panel-body-sidebar/panel-body-sidebar'
import InformacionProspecto from './components/informacion-prospecto/informacion-prospecto'
import HistorialEstados from './components/historial-estados/historial-estados'
import { Suspense } from 'react'
import PaginaProspectoHeaderSkeleton from './components/pagina-prospecto-header/pagina-prospecto-header-skeleton'
import InformacionProspectoSkeleton from './components/informacion-prospecto/informacion-prospecto-skeleton'
import HistorialEstadosSkeleton from './components/historial-estados/historial-estados-skeleton'

type ProspectoPageProps = {
	params: Promise<{
		id: string
	}>
}

export default async function ProspectoPage({ params }: ProspectoPageProps) {
	const { id } = await params

	const cookieStore = await cookies()
	const cookieHeader = cookieStore.toString()

	const prospectoPromise = obtenerProspecto(Number(id), cookieHeader)

	return (
		<PanelLayout>
			<PanelHeader>
				<Suspense fallback={<PaginaProspectoHeaderSkeleton />}>
					<PaginaProspectoHeader prospectoPromise={prospectoPromise} />
				</Suspense>
			</PanelHeader>

			<PanelBody>
				<PanelBodyMainContent>
					<Suspense fallback={<InformacionProspectoSkeleton />}>
						<InformacionProspecto prospectoPromise={prospectoPromise} />
					</Suspense>
					<Suspense fallback={<HistorialEstadosSkeleton />}>
						<HistorialEstados prospectoPromise={prospectoPromise} />
					</Suspense>
				</PanelBodyMainContent>

				<PanelBodySidebar>
					<p>sidebar</p>
				</PanelBodySidebar>
			</PanelBody>
		</PanelLayout>
	)
}
