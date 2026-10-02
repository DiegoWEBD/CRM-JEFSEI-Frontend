import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import RecordatoriosUsuario from '@/components/card-calendario/recordatorios-usuario/recordatorios-usuario'
import { CalendarClock } from 'lucide-react'
import HomeSeccion from '../home-seccion/home-seccion'

type HomeRecordatoriosHoyProps = {
	fecha: string
	prospectos?: ProspectoResumenJson[]
}

export default function HomeRecordatoriosHoy({
	fecha,
	prospectos,
}: HomeRecordatoriosHoyProps) {
	return (
		<HomeSeccion icono={CalendarClock} titulo='Recordatorios'>
			<RecordatoriosUsuario fecha={fecha} prospectos={prospectos} />
		</HomeSeccion>
	)
}
