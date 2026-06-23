import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/obtener-prospectos'
import CardQueryProspectos from './card-query-prospectos'

export default async function CardProspectos() {
	const prospectos = await obtenerProspectos()

	return <CardQueryProspectos prospectosIniciales={prospectos} />
}
