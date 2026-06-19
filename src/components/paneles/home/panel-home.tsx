import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/obtener-prospectos'
import { getSession } from '@/lib/auth'
import PanelHomeClient from './panel-home-client'

const PanelHome = async () => {
	const prospectos = await obtenerProspectos()
	const session = await getSession()

	return (
		<PanelHomeClient
			prospectosIniciales={prospectos}
			codigoRoles={session?.codigo_roles ?? []}
		/>
	)
}

export default PanelHome
