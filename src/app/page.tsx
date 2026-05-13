import PanelEjecutivoComercial from '@/components/paneles/ejecutivo-comercial/panel-ejecutivo-comercial'
import { hasRole } from '@/lib/auth'

export default async function Home() {
	const esEjecutivoComercial = await hasRole('EJECUTIVO_COMERCIAL')

	return <>{esEjecutivoComercial && <PanelEjecutivoComercial />}</>
}
