import ProspectoResumenJson from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import Estado from '@/components/estado/estado'
import { normalizarFechaTexto } from '@/utils/normalizar-fecha-texto'
import Link from 'next/link'
import { CiCalendar } from 'react-icons/ci'

type CardProspectosItemProps = {
	prospecto: ProspectoResumenJson
}

const CardProspectosItem = ({ prospecto }: CardProspectosItemProps) => {
	const fechaUltimaAccion = new Date(prospecto.fecha_ultima_accion)

	const fechaTexto = normalizarFechaTexto(fechaUltimaAccion)

	return (
		<Link
			href={`/prospectos/${prospecto.id}`}
			className='flex flex-col gap-y-3 border-t border-border-primary py-3 transition-all hover:bg-card-hover '
		>
			<div>
				<div className='flex gap-2 justify-between'>
					<p className='text-primary-highlight font-semibold max-w-2/3'>
						{prospecto.nombre_riesgo}
					</p>
					<Estado color={prospecto.color_estado} conBorde className='text-xs'>
						{prospecto.estado}
					</Estado>
				</div>

				<p className='text-subtitle'>{prospecto.nombre_contacto}</p>
			</div>
			<div className='flex flex-col gap-y-3'>
				<p>{prospecto.linea_negocio}</p>
				<p className='hidden'>{prospecto.estado}</p>
				<div className='flex items-center gap-1'>
					<CiCalendar size={'1.1rem'} />
					<p className='text-subtitle'>{fechaTexto}</p>
				</div>
				{prospecto.proxima_accion && (
					<div className='flex gap-1'>
						<p>Próxima acción</p>
						<p className='text-subtitle'>{prospecto.proxima_accion}</p>
					</div>
				)}
			</div>
		</Link>
	)
}

export default CardProspectosItem
