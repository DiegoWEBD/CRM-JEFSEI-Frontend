'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'

import { formatearFecha } from '@/utils/formatear-fecha'
import Calendario from '@/components/calendario/calendario'
import Select from '@/components/forms/select/select'
import SelectContent from '@/components/forms/select/select-content/select-content'
import SelectItem from '@/components/forms/select/select-item/select-item'
import SelectTrigger from '@/components/forms/select/select-trigger/select-trigger'
import SelectValue from '@/components/forms/select/select-value/select-value'
import HomeSeccion from '../home-seccion/home-seccion'
import { CalendarDays } from 'lucide-react'

type HomeCalendarioMesProps = {
	diaSeleccionado: string
	onDiaSeleccionadoChange: (iso: string) => void
}

export default function HomeCalendarioMes({
	diaSeleccionado,
	onDiaSeleccionadoChange,
}: HomeCalendarioMesProps) {
	const [fechaActual, setFechaActual] = useState(() => new Date())
	const hoyIso = useMemo(() => formatearFecha(new Date(), 'yyyy-MM-dd'), [])

	const diasCalendario = useMemo(() => {
		const anio = fechaActual.getFullYear()
		const mes = fechaActual.getMonth()
		const primerDiaMes = new Date(anio, mes, 1)
		const offsetLunes = (primerDiaMes.getDay() + 6) % 7
		const inicio = new Date(primerDiaMes)
		inicio.setDate(primerDiaMes.getDate() - offsetLunes)
		return Array.from({ length: 35 }, (_, i) => {
			const d = new Date(inicio)
			d.setDate(inicio.getDate() + i)
			const iso = formatearFecha(d, 'yyyy-MM-dd')
			return {
				iso,
				dia: d.getDate(),
				esMesActual: d.getMonth() === mes && d.getFullYear() === anio,
				esHoy: iso === hoyIso,
				tieneRecordatorio: false,
			}
		})
	}, [fechaActual, hoyIso])

	return (
		<HomeSeccion
			icono={CalendarDays}
			titulo='Calendario'
			accion={
				<div className='flex items-center gap-1'>
					<button
						type='button'
						className='flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground'
						onClick={() =>
							setFechaActual(
								prev =>
									new Date(prev.getFullYear(), prev.getMonth() - 1),
							)
						}
					>
						<ChevronLeft className='h-3.5 w-3.5' aria-hidden />
					</button>
					<Select
						value={fechaActual.getMonth().toString()}
						onValueChange={value =>
							setFechaActual(
								prev => new Date(prev.getFullYear(), Number(value)),
							)
						}
					>
						<SelectTrigger className='h-6 w-[90px] border-none px-1 text-xs font-medium capitalize text-foreground shadow-none hover:bg-muted'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{[
								'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
								'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
							].map((nombre, idx) => (
								<SelectItem
									key={idx}
									value={idx.toString()}
									className='text-xs'
								>
									{nombre}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<button
						type='button'
						className='flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground'
						onClick={() =>
							setFechaActual(
								prev =>
									new Date(prev.getFullYear(), prev.getMonth() + 1),
							)
						}
					>
						<ChevronRight className='h-3.5 w-3.5' aria-hidden />
					</button>
				</div>
			}
		>
			<Calendario
				dias={diasCalendario}
				diaSeleccionado={diaSeleccionado}
				onSeleccionarDia={onDiaSeleccionadoChange}
			/>
		</HomeSeccion>
	)
}
