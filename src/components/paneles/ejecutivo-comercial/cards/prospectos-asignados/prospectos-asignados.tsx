import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/obtener-prospectos'
import CardProspectos from '@/components/prospectos/card-prospectos/card-prospectos'
import { getSession } from '@/lib/auth'
import { cookies } from 'next/headers'

const ProspectosAsignados = async () => {
	const session = await getSession()
	const cookieStore = await cookies()

	const prospectos = await obtenerProspectos({
		rutUsuario: session?.sub,
		cookie: cookieStore.toString(),
	})

	return (
		<CardProspectos prospectos={prospectos} titulo='Prospectos asignados' />
	)
}

export default ProspectosAsignados
