import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/obtener-prospectos'
import { cookies } from 'next/headers'
import CardProspectosClient from './card-prospectos-client'

export default async function CardProspectos() {
	const cookieStore = await cookies()
	const prospectos = await obtenerProspectos({
		cookie: cookieStore.toString(),
	})

	return <CardProspectosClient prospectos={prospectos} />
}
