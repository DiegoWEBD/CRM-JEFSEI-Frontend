import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/obtener-prospectos'
import PanelEjecutivoComercialClient from './panel-ejecutivo-comercial-client'

const PanelEjecutivoComercial = async () => {
	const prospectos = await obtenerProspectos()

	return <PanelEjecutivoComercialClient prospectosIniciales={prospectos} />
}

export default PanelEjecutivoComercial
