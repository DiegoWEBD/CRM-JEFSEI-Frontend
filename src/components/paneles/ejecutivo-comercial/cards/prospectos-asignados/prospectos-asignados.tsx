import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/obtener-prospectos'
import CardProspectos from '@/components/prospectos/card-prospectos/card-prospectos'
import { cookies } from 'next/headers'

const ProspectosAsignados = async () => {
	const cookieStore = await cookies()

	const prospectos = await obtenerProspectos({
		cookie: cookieStore.toString(),
	})

	return (
		<CardProspectos prospectos={prospectos} titulo='Prospectos asignados' />
	)
}

export default ProspectosAsignados
