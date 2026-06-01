import Card from '../card/card'
import CardHeader from '../card/card-header/card-header'

type ProgresoMetaProps = {
	className?: string
	actual?: number
	meta?: number
}

const ProgresoMeta = ({
	className,
	actual = 12500,
	meta = 20000,
}: ProgresoMetaProps) => {
	const porcentaje = Math.min((actual / meta) * 100, 100).toFixed(1)

	return (
		<Card className={className}>
			<CardHeader title='Progreso de Ventas' />{' '}
			<h2 className='text-2xl md:text-3xl font-semibold mt-2'>
				{actual.toLocaleString('es-CL')} UF
			</h2>
			<div className='mt-3'>
				<div className='w-full bg-gray-200 rounded-full h-2'>
					<div
						className='bg-yellow-500 h-2 rounded-full transition-all'
						style={{ width: `${porcentaje}%` }}
					/>
				</div>
			</div>
			<div className='flex justify-between text-sm text-gray-600 mt-2'>
				<span>{porcentaje}% completado</span>
				<span>Meta: {meta.toLocaleString('es-CL')} UF</span>
			</div>
		</Card>
	)
}

export default ProgresoMeta
