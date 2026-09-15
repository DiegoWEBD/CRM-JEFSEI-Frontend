'use client'

import { Input } from '@/components/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/select'
import type { FiltrosPolizasState } from '@/hooks/polizas/use-filtros-polizas'
import { TODOS } from '@/hooks/polizas/use-filtros-polizas'
import { useCompaniesSeguros } from '@/hooks/companies-seguros/use-companies-seguros'
import { useLineasNegocio } from '@/hooks/lineas-negocio/use-lineas-negocio'
import { Search, X } from 'lucide-react'

type FiltrosPolizasProps = {
	filtros: FiltrosPolizasState
	onActualizar: <K extends keyof FiltrosPolizasState>(
		key: K,
		value: FiltrosPolizasState[K],
	) => void
	onLimpiar: () => void
	hayFiltrosActivos: boolean
	total?: number
}

export default function FiltrosPolizas({
	filtros,
	onActualizar,
	onLimpiar,
	hayFiltrosActivos,
	total,
}: FiltrosPolizasProps) {
	const { data: companies } = useCompaniesSeguros({ enabled: true })
	const { data: lineasNegocio } = useLineasNegocio()

	return (
		<div className='rounded-lg border border-border/70 bg-card p-3'>
			<div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
				<div className='sm:col-span-2 lg:col-span-1'>
					<label className='mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'>
						Búsqueda
					</label>
					<div className='relative'>
						<Search className='pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground' />
						<Input
							placeholder='N° póliza o cliente…'
							value={filtros.texto_busqueda}
							onChange={e => onActualizar('texto_busqueda', e.target.value)}
							className='h-8 pl-8 text-xs shadow-none'
						/>
					</div>
				</div>

				<div>
					<label className='mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'>
						Compañía
					</label>
					<Select
						value={filtros.id_company}
						onValueChange={v => onActualizar('id_company', v)}
					>
						<SelectTrigger size='sm' className='h-8 w-full text-xs shadow-none'>
							<SelectValue placeholder='Todas' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={TODOS} className='text-xs'>
								Todas las compañías
							</SelectItem>
							{companies?.map(op => (
								<SelectItem
									key={op.id}
									value={String(op.id)}
									className='text-xs'
								>
									{op.nombre}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div>
					<label className='mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'>
						Línea de negocio
					</label>
					<Select
						value={filtros.id_linea_negocio}
						onValueChange={v => onActualizar('id_linea_negocio', v)}
					>
						<SelectTrigger size='sm' className='h-8 w-full text-xs shadow-none'>
							<SelectValue placeholder='Todas' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={TODOS} className='text-xs'>
								Todas las líneas
							</SelectItem>
							{lineasNegocio?.map(op => (
								<SelectItem
									key={op.id}
									value={String(op.id)}
									className='text-xs'
								>
									{op.nombre}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className='mt-2 flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					{hayFiltrosActivos && (
						<button
							type='button'
							onClick={onLimpiar}
							className='inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors'
						>
							<X className='h-3 w-3' aria-hidden />
							Limpiar filtros
						</button>
					)}
				</div>
				{total != null && (
					<span className='text-xs tabular-nums text-muted-foreground'>
						{total} resultado{total !== 1 ? 's' : ''}
					</span>
				)}
			</div>
		</div>
	)
}
