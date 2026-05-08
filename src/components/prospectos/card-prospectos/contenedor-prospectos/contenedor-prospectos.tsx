import ProspectoResumenJson from '@/aplicacion/prospectos/dto/prospecto-resumen-json'
import CardProspectosItem from './card-prospectos-item/card-prospectos-item'

type ContenedorProspectosProps = {
	prospectos: ProspectoResumenJson[]
}

const ContenedorProspectos = ({ prospectos }: ContenedorProspectosProps) => {
	return (
		<div className='flex flex-col'>
			{prospectos.map(prospecto => (
				<CardProspectosItem
					key={prospecto.nombre_riesgo}
					prospecto={prospecto}
				/>
			))}
		</div>
	)
}

export default ContenedorProspectos
