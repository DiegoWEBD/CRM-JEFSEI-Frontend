import { obtenerDashboardCobranza } from '@/aplicacion/cobranza/use-cases/obtener-dashboard-cobranza/obtener-dashboard-cobranza'
import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/obtener-prospectos'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth'
import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import PanelHomeClient from './panel-home-client'

const PanelHome = async () => {
	const queryClient = new QueryClient()

	await queryClient.query({
		queryKey: ['prospectos', null, '', 1, 10, null, null, null],
		queryFn: () => obtenerProspectos({ pagina: 1, tamanoPagina: 10 }),
	})

	const session = await getSession()
	const codigoRoles = session?.codigo_roles ?? []

	let dashboardInicial = undefined
	if (codigoRoles.includes('EJECUTIVO_COBRANZA')) {
		try {
			const cookieStore = await cookies()
			dashboardInicial = await obtenerDashboardCobranza(cookieStore.toString())
		} catch {
			dashboardInicial = undefined
		}
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<PanelHomeClient
				codigoRoles={codigoRoles}
				nombreUsuario={session?.nombre ?? ''}
				dashboardCobranzaInicial={dashboardInicial}
			/>
		</HydrationBoundary>
	)
}

export default PanelHome
