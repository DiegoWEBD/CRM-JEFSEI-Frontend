import { ProspectoJson } from '@/aplicacion/prospectos/use-cases/obtener-prospecto/dto/prospecto-json'
import InicialesUsuario from '@/app/personal/components/iniciales-usuario'
import Card from '@/components/card/card'
import Estado from '@/components/estado/estado'
import TituloPrincipal from '@/components/titulos/titulo-principal'
import { BsPersonWorkspace } from 'react-icons/bs'
import { FaRegUser } from 'react-icons/fa6'
import { FiBriefcase } from 'react-icons/fi'

type PaginaProspectoHeaderProps = {
	prospectoPromise: Promise<ProspectoJson>
}

const PaginaProspectoHeader = async ({
	prospectoPromise,
}: PaginaProspectoHeaderProps) => {
	const prospecto = await prospectoPromise

	const ultimoEstado =
		prospecto.historial_estados[prospecto.historial_estados.length - 1]

	return (
		<Card className='flex flex-col md:flex-row gap-4 py-8 px-6'>
			<div className='flex gap-6 w-full items-center'>
				<div>
					<InicialesUsuario
						nombre={prospecto.nombre_riesgo}
						className='h-14 w-14 text-xl'
					/>
				</div>

				<div className='w-fit flex flex-col'>
					<TituloPrincipal className='text-xl mb-2'>
						{prospecto.nombre_riesgo}
					</TituloPrincipal>
					<div className='flex items-center gap-2 text-subtitle'>
						<FaRegUser size={'.9rem'} />
						<p>{prospecto.nombre_contacto}</p>
					</div>

					<div className='flex items-center gap-2 text-subtitle'>
						<FiBriefcase size={'.9rem'} />
						<p>{prospecto.linea_negocio}</p>
					</div>
				</div>
			</div>

			<div className='w-full flex flex-col md:items-end'>
				<Estado
					conBorde
					className='text-sm font-semibold'
					color={ultimoEstado.color}
				>
					{ultimoEstado.estado}
				</Estado>
				<div className='space-y-1 mt-3'>
					<div className='text-subtitle text-sm flex gap-2 items-center'>
						<BsPersonWorkspace size={'.9rem'} />
						<p>Comercial:</p>
						<p className='text-normal'>
							{prospecto.evaluacion_riesgo?.ej_comercial?.nombre ||
								'No asignado'}
						</p>
					</div>

					<div className='text-subtitle text-sm flex gap-2 items-center'>
						<BsPersonWorkspace size={'.9rem'} />
						<p>Evaluación:</p>
						<p className='text-normal'>
							{prospecto.evaluacion_riesgo?.ej_evaluacion?.nombre ||
								'No asignado'}
						</p>
					</div>
				</div>
			</div>
		</Card>
	)
}

export default PaginaProspectoHeader
