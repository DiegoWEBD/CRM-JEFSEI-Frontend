import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/obtener-prospectos'
import PanelProspectosClient from './panel-prospectos-client'

export default async function PanelProspectos() {
	const resultado = await obtenerProspectos({ pagina: 1, tamanoPagina: 10 })

	return <PanelProspectosClient inicial={resultado} />
}
