import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/obtener-prospectos'
import CardProspectosClient from './card-prospectos-client'

export default async function CardProspectos() {
	const resultado = await obtenerProspectos({ pagina: 1, tamanoPagina: 10 })
	return <CardProspectosClient initialData={resultado} />
}
