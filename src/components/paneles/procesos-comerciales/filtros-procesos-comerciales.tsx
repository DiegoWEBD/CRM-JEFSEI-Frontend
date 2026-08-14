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
	ejecutivo: string
	etapa: string
}

type FiltrosProcesosComercialesProps = {
	filtros: FiltrosPanel
	onChange: (f: FiltrosPanel) => void
	opcionesEjecutivo: string[]
	opcionesEtapa: string[]
	total?: number
	filtrados?: number
}

export default function FiltrosProcesosComerciales({
	filtros,
	onChange,
	opcionesEjecutivo,
	opcionesEtapa,
	total,
	filtrados,
}: FiltrosProcesosComercialesProps) {
	const actualizar = (key: keyof FiltrosPanel, value: string) => {
		onChange({ ...filtros, [key]: value })
	}

	const limpiar = () => {
		onChange({
			busqueda: '',
			ejecutivo: TODOS,
			etapa: TODOS,
		})
	}

	const hayFiltros =
		filtros.busqueda !== '' ||
		filtros.ejecutivo !== TODOS ||
		filtros.etapa !== TODOS

	const mostrarContador = total != null && filtrados != null

	return (
		<div className='flex flex-wrap items-center gap-2'>
			<div className='relative min-w-[12rem] flex-1'>
				<Search className='pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground' />
				<Input
					placeholder='Buscar por cliente, ejecutivo, producto…'
					value={filtros.busqueda}
					onChange={e => actualizar('busqueda', e.target.value)}
					className='h-9 pl-8 text-xs shadow-none'
				/>
			</div>

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
				value={filtros.etapa}
				onValueChange={v => actualizar('etapa', v)}
			>
				<SelectTrigger
					size='sm'
					className='h-9 w-[min(100%,9rem)] text-xs shadow-none'
				>
					<SelectValue placeholder='Etapa' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={TODOS} className='text-xs'>
						Todas
					</SelectItem>
					{opcionesEtapa.map(op => (
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

			{mostrarContador && (
				<span className='text-[11px] text-muted-foreground'>
					Mostrando {filtrados} de {total} oportunidades
				</span>
			)}
		</div>
	)
}