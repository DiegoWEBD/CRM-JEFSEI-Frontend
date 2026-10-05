'use client'

import { CalendarClock } from 'lucide-react'
import { useMemo, useState } from 'react'

import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import RecordatoriosUsuario from '@/components/card-calendario/recordatorios-usuario/recordatorios-usuario'
import Input from '@/components/forms/input/input'
import HomeSeccion from '../home-seccion/home-seccion'
import { formatearFecha } from '@/utils/formatear-fecha'

type HomeRecordatoriosHoyProps = {
	prospectos?: ProspectoResumenJson[]
	className?: string
}

export default function HomeRecordatoriosHoy({
	prospectos,
	className,
}: HomeRecordatoriosHoyProps) {
	const hoyIso = useMemo(() => formatearFecha(new Date(), 'yyyy-MM-dd'), [])
	const [fecha, setFecha] = useState(hoyIso)

	return (
		<HomeSeccion
			className={className}
			icono={CalendarClock}
			titulo='Recordatorios'
			accion={
				<Input
					type='date'
					value={fecha}
					onChange={e => setFecha(e.target.value)}
					className='h-8 w-37.5 text-xs shadow-none'
				/>
			}
		>
			<RecordatoriosUsuario fecha={fecha} prospectos={prospectos} />
		</HomeSeccion>
	)
}
