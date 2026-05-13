import { obtenerProspectos } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/obtener-prospectos'
import Card from '@/components/card/card'
import CardHeader from '@/components/card/card-header/card-header'
import { cookies } from 'next/headers'
import { TbUsers } from 'react-icons/tb'
import ContenedorProspectos from './contenedor-prospectos/contenedor-prospectos'

type CardProspectosProps = {
	titulo?: string
}

const CardProspectos = async ({ titulo }: CardProspectosProps) => {
	const cookieStore = await cookies()
	const prospectos = await obtenerProspectos({
		cookie: cookieStore.toString(),
	})

	return (
		<Card>
			<CardHeader title={titulo ?? 'Prospectos'} icon={<TbUsers />} primary />
			<ContenedorProspectos prospectos={prospectos} />
		</Card>
	)
}

export default CardProspectos
