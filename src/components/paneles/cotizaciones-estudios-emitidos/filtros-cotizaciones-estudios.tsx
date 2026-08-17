'use client'

import { Input } from '@/components/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/button'

export const TODOS = '__todos__'

export type FiltrosPanel = {
	busqueda: string
	estado_estudio: string
	prioridad: string
	ejecutivo: string
	linea: string
}

type FiltrosCotizacionesEstudiosProps = {
	filtros: FiltrosPanel
	onChange: (f: FiltrosPanel) => void
	opcionesEjecutivo: string[]
	opcionesLinea: string[]
	total: number
	filtrados: number
}

const ESTADOS_ESTUDIO = [
	{ value: TODOS, label: 'Todos' },
	{ value: 'pendiente', label: 'Pendiente' },
	{ value: 'disponible', label: 'Disponible' },
]

const PRIORIDADES = [
	{ value: TODOS, label: 'Todas' },
	{ value: 'alta', label: 'Alta' },
	{ value: 'normal', label: 'Normal' },
]

export default function FiltrosCotizacionesEstudios({
	filtros,
	onChange,
	opcionesEjecutivo,
	opcionesLinea,
	total,
	filtrados,
}: FiltrosCotizacionesEstudiosProps) {
	const actualizar = (key: keyof FiltrosPanel, value: string) => {
		onChange({ ...filtros, [key]: value })
	}

	const limpiar = () => {
		onChange({
			busqueda: '',
			estado_estudio: TODOS,
			prioridad: TODOS,
			ejecutivo: TODOS,
			linea: TODOS,
		})
	}

	const hayFiltros =
		filtros.busqueda !== '' ||
		filtros.estado_estudio !== TODOS ||
		filtros.prioridad !== TODOS ||
		filtros.ejecutivo !== TODOS ||
		filtros.linea !== TODOS

	return (
		<div className='flex flex-wrap items-center gap-2'>
			<div className='relative min-w-[12rem] flex-1'>
				<Search className='pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground' />
				<Input
					placeholder='Buscar por cliente, ejecutivo, línea…'
					value={filtros.busqueda}
					onChange={e => actualizar('busqueda', e.target.value)}
					className='h-9 pl-8 text-xs shadow-none'
				/>
			</div>

			<Select
				value={filtros.estado_estudio}
				onValueChange={v => actualizar('estado_estudio', v)}
			>
				<SelectTrigger
					size='sm'
					className='h-9 w-[min(100%,9rem)] text-xs shadow-none'
				>
					<SelectValue placeholder='Estado estudio' />
				</SelectTrigger>
				<SelectContent>
					{ESTADOS_ESTUDIO.map(op => (
						<SelectItem key={op.value} value={op.value} className='text-xs'>
							{op.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={filtros.prioridad}
				onValueChange={v => actualizar('prioridad', v)}
			>
				<SelectTrigger
					size='sm'
					className='h-9 w-[min(100%,9rem)] text-xs shadow-none'
				>
					<SelectValue placeholder='Prioridad' />
				</SelectTrigger>
				<SelectContent>
					{PRIORIDADES.map(op => (
						<SelectItem key={op.value} value={op.value} className='text-xs'>
							{op.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={filtros.ejecutivo}
				onValueChange={v => actualizar('ejecutivo', v)}
			>
				<SelectTrigger
					size='sm'
					className='h-9 w-[min(100%,11rem)] text-xs shadow-none'
				>
					<SelectValue placeholder='Ejecutivo' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={TODOS} className='text-xs'>
						Todos
					</SelectItem>
					{opcionesEjecutivo.map(op => (
						<SelectItem key={op} value={op} className='text-xs'>
							{op}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={filtros.linea}
				onValueChange={v => actualizar('linea', v)}
			>
				<SelectTrigger
					size='sm'
					className='h-9 w-[min(100%,10rem)] text-xs shadow-none'
				>
					<SelectValue placeholder='Línea seguro' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={TODOS} className='text-xs'>
						Todas
					</SelectItem>
					{opcionesLinea.map(op => (
						<SelectItem key={op} value={op} className='text-xs'>
							{op}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{hayFiltros && (
				<Button
					variant='ghost'
					size='sm'
					onClick={limpiar}
					className='h-9 gap-1 px-2 text-xs text-muted-foreground'
				>
					<X className='h-3.5 w-3.5' aria-hidden />
					Limpiar
				</Button>
			)}

			<span className='text-sm text-muted-foreground'>
				Mostrando {filtrados} de {total} cotizaciones
			</span>
		</div>
	)
}