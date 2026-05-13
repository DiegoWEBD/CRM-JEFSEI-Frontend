import { HistorialEstadoJson } from '@/aplicacion/estados/dto/historial-estado-json'
import Card from '@/components/card/card'
import CardHeader from '@/components/card/card-header/card-header'
import { RxCounterClockwiseClock } from 'react-icons/rx'

type HistorialInteraccionesProps = {
	historialEstados: HistorialEstadoJson[]
}

const HistorialInteracciones = ({
	historialEstados,
}: HistorialInteraccionesProps) => {
	/*historialEstados.forEach(historial => {
		console.log(historial)
	})*/

	return (
		<Card>
			<CardHeader
				title='Historial de Interacciones'
				icon={<RxCounterClockwiseClock />}
				primary
			/>
		</Card>
	)
}

export default HistorialInteracciones
