import { obtenerDashboardCobranza } from '@/aplicacion/cobranza/use-cases/obtener-dashboard-cobranza/obtener-dashboard-cobranza'
import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/obtener-prospectos'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth'
import PanelHomeClient from './panel-home-client'

const PanelHome = async () => {
	const prospectos = await obtenerProspectos()
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
		<PanelHomeClient
			prospectosIniciales={prospectos}
			codigoRoles={codigoRoles}
			dashboardCobranzaInicial={dashboardInicial}
		/>
	)
}

export default PanelHome
