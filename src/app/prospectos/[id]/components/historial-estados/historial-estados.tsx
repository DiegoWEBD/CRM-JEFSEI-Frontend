import { ProspectoJson } from '@/aplicacion/prospectos/use-cases/obtener-prospecto/dto/prospecto-json'
import Card from '@/components/card/card'
import CardHeader from '@/components/card/card-header/card-header'
import { RxCounterClockwiseClock } from 'react-icons/rx'
import ItemHistorialEstados from './item-historial-estados/item-historial-estados'

type HistorialInteraccionesProps = {
	prospectoPromise: Promise<ProspectoJson>
}

const HistorialEstados = async ({
	prospectoPromise,
}: HistorialInteraccionesProps) => {
	const prospecto = await prospectoPromise
	const historialEstados = prospecto.historial_estados

	return (
		<Card>
			<CardHeader
				title='Historial de Acciones'
				icon={<RxCounterClockwiseClock />}
				primary
			/>
			<div className='space-y-8'>
				{historialEstados.map((estado, i) => (
					<ItemHistorialEstados key={i} estado={estado} />
				))}
			</div>
		</Card>
	)
}

export default HistorialEstados
