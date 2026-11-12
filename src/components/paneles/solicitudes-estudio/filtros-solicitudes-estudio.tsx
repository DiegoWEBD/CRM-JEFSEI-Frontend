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
import FiltroUsuario from '@/components/filtro-usuario/filtro-usuario'
import type { Prioridad } from '@/types/prioridad/prioridad'

export const TODOS = '__todos__'

export type FiltrosSolicitudes = {
	busqueda: string
	/** Estado del panel (uno de los 4 contadores) o TODOS. */
	estado: string
	/** Prioridad ('alta' | 'normal') o TODOS. */
	prioridad: string
	/** RUT del ejecutivo comercial; '' = todos (convención de FiltroUsuario). */
	rutUsuario: string
}

export const FILTROS_POR_DEFECTO: FiltrosSolicitudes = {
	busqueda: '',
	estado: TODOS,
	prioridad: TODOS,
	rutUsuario: '',
}

const ESTADOS = [
	'informacion_incompleta',
	'listas_para_cotizar',
	'cotizaciones_emitidas',
	'estudios_emitidos',
] as const

const ESTADO_LABELS: Record<(typeof ESTADOS)[number], string> = {
	informacion_incompleta: 'Información incompleta',
	listas_para_cotizar: 'Listas para cotizar',
	cotizaciones_emitidas: 'Cotizaciones emitidas',
	estudios_emitidos: 'Estudios emitidos',
}

const PRIORIDADES: Prioridad[] = ['alta', 'normal']

type FiltrosSolicitudesEstudioProps = {
	filtros: FiltrosSolicitudes
	onChange: (filtros: FiltrosSolicitudes) => void
	total: number
	filtrados: number
}

export default function FiltrosSolicitudesEstudio({
	filtros,
	onChange,
	total,
	filtrados,
}: FiltrosSolicitudesEstudioProps) {
	const hayFiltrosActivos =
		filtros.busqueda.trim() !== '' ||
		filtros.estado !== TODOS ||
		filtros.prioridad !== TODOS ||
		filtros.rutUsuario !== ''

	const limpiarFiltros = () => {
		onChange({ ...FILTROS_POR_DEFECTO })
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
					placeholder='Buscar por cliente, línea de seguro o ejecutivo…'
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
					aria-label='Estado'
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
							{ESTADO_LABELS[e]}
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
					aria-label='Prioridad'
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

			<FiltroUsuario
				value={filtros.rutUsuario}
				onChange={rutUsuario => actualizar({ rutUsuario })}
				filtroRoles={[
					'EJECUTIVO_COMERCIAL',
					'EJECUTIVO_EVALUACION_PROYECTOS',
					'GERENTE_GENERAL',
					'GERENTE_COMERCIAL',
					'GERENTE_OPERACIONES',
				]}
			/>

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
