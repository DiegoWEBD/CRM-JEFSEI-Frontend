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
import { useCompaniesSeguros } from '@/hooks/companies-seguros/use-companies-seguros'
import { useLineasNegocio } from '@/hooks/lineas-negocio/use-lineas-negocio'

export const TODOS = '__todos__'

export type FiltrosPanelPolizas = {
	texto_busqueda: string
	id_company: string
	id_linea_negocio: string
}

type FiltrosPolizasProps = {
	filtros: FiltrosPanelPolizas
	onChange: (f: FiltrosPanelPolizas) => void
	total?: number
}

export default function FiltrosPolizas({
	filtros,
	onChange,
	total,
}: FiltrosPolizasProps) {
	const { data: companies } = useCompaniesSeguros()
	const { data: lineasNegocio } = useLineasNegocio()

	const actualizar = (key: keyof FiltrosPanelPolizas, value: string) => {
		onChange({ ...filtros, [key]: value })
	}

	const limpiar = () => {
		onChange({
			texto_busqueda: '',
			id_company: TODOS,
			id_linea_negocio: TODOS,
		})
	}

	const hayFiltros =
		filtros.texto_busqueda !== '' ||
		filtros.id_company !== TODOS ||
		filtros.id_linea_negocio !== TODOS

	return (
		<div className='flex flex-wrap items-center gap-2'>
			<div className='relative min-w-[12rem] flex-1'>
				<Search className='pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground' />
				<Input
					placeholder='Buscar por número de póliza o nombre de cliente…'
					value={filtros.texto_busqueda}
					onChange={e => actualizar('texto_busqueda', e.target.value)}
					className='h-9 pl-8 text-xs shadow-none'
				/>
			</div>

			<Select
				value={filtros.id_company}
				onValueChange={v => actualizar('id_company', v)}
			>
				<SelectTrigger
					size='sm'
					className='h-9 w-[min(100%,11rem)] text-xs shadow-none'
				>
					<SelectValue placeholder='Compañía' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={TODOS} className='text-xs'>
						Todas las compañías
					</SelectItem>
					{companies?.map(op => (
						<SelectItem key={op.id} value={String(op.id)} className='text-xs'>
							{op.nombre}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={filtros.id_linea_negocio}
				onValueChange={v => actualizar('id_linea_negocio', v)}
			>
				<SelectTrigger
					size='sm'
					className='h-9 w-[min(100%,11rem)] text-xs shadow-none'
				>
					<SelectValue placeholder='Línea de negocio' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={TODOS} className='text-xs'>
						Todas las líneas
					</SelectItem>
					{lineasNegocio?.map(op => (
						<SelectItem key={op.id} value={String(op.id)} className='text-xs'>
							{op.nombre}
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

			{total != null && (
				<span className='text-sm text-muted-foreground'>
					Mostrando {total} pólizas
				</span>
			)}
		</div>
	)
}
