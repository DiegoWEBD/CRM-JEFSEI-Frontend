'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import { Button } from '@/components/button'
import type { Prioridad } from '@/types/prioridad/prioridad'
import { ESTADO_BANDEJA_LABELS } from './badge-estado-solicitud'

export const TODOS = '__todos__'

export type FiltrosSolicitudes = {
	busqueda: string
	estado: string
	prioridad: string
	ejecutivo: string
	linea: string
}

type FiltrosSolicitudesEstudioProps = {
	filtros: FiltrosSolicitudes
	onChange: (filtros: FiltrosSolicitudes) => void
	opcionesEjecutivo: string[]
	opcionesLinea: string[]
	total: number
	filtrados: number
}

const ESTADOS = ['informacion_incompleta', 'lista_para_cotizar', 'con_cotizaciones', 'estudio_emitido'] as const

const PRIORIDADES: Prioridad[] = ['alta', 'normal']

export default function FiltrosSolicitudesEstudio({
	filtros,
	onChange,
	opcionesEjecutivo,
	opcionesLinea,
	total,
	filtrados,
}: FiltrosSolicitudesEstudioProps) {
	const hayFiltrosActivos =
		filtros.busqueda.trim() !== '' ||
		filtros.estado !== TODOS ||
		filtros.prioridad !== TODOS ||
		filtros.ejecutivo !== TODOS ||
		filtros.linea !== TODOS

	const limpiarFiltros = () => {
		onChange({
			busqueda: '',
			estado: TODOS,
			prioridad: TODOS,
			ejecutivo: TODOS,
			linea: TODOS,
		})
	}

	const actualizar = (patch: Partial<FiltrosSolicitudes>) => {
		onChange({ ...filtros, ...patch })
	}

	return (
		<div className='flex flex-wrap items-center gap-2'>
			<div className='relative min-w-[12rem] flex-1'>
				<Search
					className='pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground'
					aria-hidden
				/>
				<Input
					className='h-9 pl-8 text-xs shadow-none'
					placeholder='Buscar por cliente, lÃ­nea de seguro o ejecutivoâ€¦'
					value={filtros.busqueda}
					onChange={e => actualizar({ busqueda: e.target.value })}
				/>
			</div>

			<Select
				value={filtros.estado}
				onValueChange={value => actualizar({ estado: value })}
			>
				<SelectTrigger
					size='sm'
					className='h-9 w-[min(100%,11rem)] text-xs shadow-none'
				>
					<SelectValue placeholder='Estado' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={TODOS} className='text-xs'>
						Estado: todos
					</SelectItem>
					{ESTADOS.map(e => (
						<SelectItem key={e} value={e} className='text-xs'>
							{ESTADO_BANDEJA_LABELS[e]}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={filtros.prioridad}
				onValueChange={value => actualizar({ prioridad: value })}
			>
				<SelectTrigger
					size='sm'
					className='h-9 w-[min(100%,9rem)] text-xs shadow-none'
				>
					<SelectValue placeholder='Prioridad' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={TODOS} className='text-xs'>
						Prioridad: todas
					</SelectItem>
					{PRIORIDADES.map(p => (
						<SelectItem key={p} value={p} className='text-xs capitalize'>
							{p === 'alta' ? 'Alta' : 'Normal'}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={filtros.ejecutivo}
				onValueChange={value => actualizar({ ejecutivo: value })}
			>
				<SelectTrigger
					size='sm'
					className='h-9 w-[min(100%,10rem)] text-xs shadow-none'
				>
					<SelectValue placeholder='Ejecutivo' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={TODOS} className='text-xs'>
						Ejecutivo: todos
					</SelectItem>
					{opcionesEjecutivo.map(e => (
						<SelectItem key={e} value={e} className='text-xs'>
							{e}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={filtros.linea}
				onValueChange={value => actualizar({ linea: value })}
			>
				<SelectTrigger
					size='sm'
					className='h-9 w-[min(100%,10rem)] text-xs shadow-none'
				>
					<SelectValue placeholder='LÃ­nea' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={TODOS} className='text-xs'>
						LÃ­nea: todas
					</SelectItem>
					{opcionesLinea.map(l => (
						<SelectItem key={l} value={l} className='text-xs'>
							{l}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{hayFiltrosActivos ? (
				<Button
					type='button'
					variant='ghost'
					size='sm'
					className='h-9 gap-1 px-2 text-xs text-muted-foreground'
					onClick={limpiarFiltros}
				>
					<X className='h-3.5 w-3.5' aria-hidden />
					Limpiar
				</Button>
			) : null}

			<span className='text-sm text-muted-foreground'>
				Mostrando {filtrados} de {total} solicitudes
			</span>
		</div>
	)
}