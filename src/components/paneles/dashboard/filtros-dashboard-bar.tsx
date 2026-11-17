'use client'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import { useFiltrosDashboard } from './filtros-dashboard-context'

const MESES = [
	'Enero',
	'Febrero',
	'Marzo',
	'Abril',
	'Mayo',
	'Junio',
	'Julio',
	'Agosto',
	'Septiembre',
	'Octubre',
	'Noviembre',
	'Diciembre',
]

/**
 * Selectores mes/año del dashboard. Cambiarlos actualiza el contexto y
 * dispara el refetch de cada tarjeta que depende del período (sus queryKeys
 * incluyen los filtros). Las métricas de oportunidades abiertas no se
 * refetchean.
 *
 * Va pegada arriba mientras se hace scroll. Debe renderizarse fuera del
 * grid de `PanelLayout` para que el sticky funcione dentro del contenedor
 * con scroll.
 */
export default function FiltrosDashboardBar() {
	const { mes, year, setMes, setYear } = useFiltrosDashboard()

	const rangoYears = Array.from(
		{ length: 5 },
		(_, i) => new Date().getFullYear() - 2 + i,
	)

	return (
		<div className='sticky top-0 z-20 -mx-3 border-b border-border/60 bg-background/95 px-3 pb-3 pt-2.5 backdrop-blur lg:-mx-8 lg:px-8'>
			<div className='flex items-center gap-3'>
				<Select value={String(mes)} onValueChange={v => setMes(Number(v))}>
					<SelectTrigger className='w-35 h-8 text-xs'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{MESES.map((nombre, i) => (
							<SelectItem key={i + 1} value={String(i + 1)} className='text-xs'>
								{nombre}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={String(year)} onValueChange={v => setYear(Number(v))}>
					<SelectTrigger className='w-25 h-8 text-xs'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{rangoYears.map(y => (
							<SelectItem key={y} value={String(y)} className='text-xs'>
								{y}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	)
}
