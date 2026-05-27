import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/obtener-prospectos'
import { cookies } from 'next/headers'
import PanelEjecutivoComercialClient from './panel-ejecutivo-comercial-client'

const PanelEjecutivoComercial = async () => {
	const cookieStore = await cookies()
	const prospectos = await obtenerProspectos({
		cookie: cookieStore.toString(),
	})

	return <PanelEjecutivoComercialClient prospectos={prospectos} />
}

export default PanelEjecutivoComercial
