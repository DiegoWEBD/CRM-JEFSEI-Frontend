import ProspectoResumenJson from '@/aplicacion/prospectos/dto/prospecto-resumen-json'
import Card from '@/components/card/card'
import CardHeader from '@/components/card/card-header/card-header'
import { TbUsers } from 'react-icons/tb'
import ContenedorProspectos from './contenedor-prospectos/contenedor-prospectos'

type CardProspectosProps = {
	prospectos: ProspectoResumenJson[]
	titulo?: string
}

const CardProspectos = ({ prospectos, titulo }: CardProspectosProps) => {
	return (
		<Card>
			<CardHeader title={titulo ?? 'Prospectos'} icon={<TbUsers />} primary />
			<ContenedorProspectos prospectos={prospectos} />
		</Card>
	)
}

export default CardProspectos
