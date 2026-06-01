import { Prospecto } from '@/dominio/prospecto/prospecto'
import Card from '@/components/card/card'
import CardHeader from '@/components/card/card-header/card-header'
import { RxCounterClockwiseClock } from 'react-icons/rx'
import ItemHistorialEstados from './item-historial-estados/item-historial-estados'
import CardTitle from '@/components/card/card-title/card-title'

type HistorialInteraccionesProps = {
	prospectoPromise: Promise<Prospecto>
}

const HistorialEstados = async ({
	prospectoPromise,
}: HistorialInteraccionesProps) => {
	const prospecto = await prospectoPromise
	const historialEstados = prospecto.proceso_comercial.historial_estados

	return (
		<Card>
			<CardHeader>
				<CardTitle>Historial de acciones</CardTitle>
				<RxCounterClockwiseClock />
			</CardHeader>
			<div className='space-y-8'>
				{historialEstados.map((estado, i) => (
					<ItemHistorialEstados key={i} estado={estado} />
				))}
			</div>
		</Card>
	)
}

export default HistorialEstados
