'use client'

import { Button } from '@/components/button'
import { Input } from '@/components/input'
import Select from '@/components/forms/select/select'
import SelectContent from '@/components/forms/select/select-content/select-content'
import SelectItem from '@/components/forms/select/select-item/select-item'
import SelectTrigger from '@/components/forms/select/select-trigger/select-trigger'
import SelectValue from '@/components/forms/select/select-value/select-value'
import { Download, RefreshCw, Search } from 'lucide-react'
import { etiquetaEvento, eventosPorCategoria } from '../lib/etiquetas-auditoria'

type FiltrosAuditoriaProps = {
	categoria: string | null
	busqueda: string
	onBusquedaChange: (valor: string) => void
	evento: string | null
	onEventoChange: (valor: string | null) => void
	fechaDesde: string | null
	onFechaDesdeChange: (valor: string | null) => void
	fechaHasta: string | null
	onFechaHastaChange: (valor: string | null) => void
	ipOrigen: string
	onIpOrigenChange: (valor: string) => void
	total: number
	totalFiltrados: number
	onActualizar: () => void
	actualizando: boolean
	onExportar: () => void
	exportando: boolean
}

export default function FiltrosAuditoria({
	categoria,
	busqueda,
	onBusquedaChange,
	evento,
	onEventoChange,
	fechaDesde,
	onFechaDesdeChange,
	fechaHasta,
	onFechaHastaChange,
	ipOrigen,
	onIpOrigenChange,
	total,
	totalFiltrados,
	onActualizar,
	actualizando,
	onExportar,
	exportando,
}: FiltrosAuditoriaProps) {
	return (
		<>
			<div className='flex flex-wrap items-center gap-2'>
				<div className='relative min-w-0 flex-1'>
					<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Buscar por usuario, ruta, IP, detalle...'
						value={busqueda}
						onChange={e => onBusquedaChange(e.target.value)}
						className='pl-9'
					/>
				</div>

				<Select
					value={evento ?? 'todos'}
					onValueChange={valor =>
						onEventoChange(valor === 'todos' ? null : valor)
					}
				>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Evento' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='todos'>Todos los eventos</SelectItem>
						{eventosPorCategoria(categoria).map(codigo => (
							<SelectItem key={codigo} value={codigo}>
								{etiquetaEvento(codigo)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Button
					variant='outline'
					size='sm'
					onClick={onActualizar}
					disabled={actualizando}
				>
					<RefreshCw
						className={`mr-1 size-4 ${actualizando ? 'animate-spin' : ''}`}
					/>
					{actualizando ? 'Actualizando...' : 'Actualizar'}
				</Button>

				<Button
					variant='outline'
					size='sm'
					onClick={onExportar}
					disabled={exportando}
				>
					<Download className='mr-1 size-4' />
					{exportando ? 'Exportando...' : 'Exportar CSV'}
				</Button>
			</div>

			<div className='mt-2 flex flex-wrap items-center gap-2'>
				<div className='flex items-center gap-1.5'>
					<label
						htmlFor='auditoria-fecha-desde'
						className='text-xs text-muted-foreground'
					>
						Desde
					</label>
					<Input
						id='auditoria-fecha-desde'
						type='date'
						value={fechaDesde ?? ''}
						onChange={e => onFechaDesdeChange(e.target.value || null)}
						className='w-40'
					/>
				</div>

				<div className='flex items-center gap-1.5'>
					<label
						htmlFor='auditoria-fecha-hasta'
						className='text-xs text-muted-foreground'
					>
						Hasta
					</label>
					<Input
						id='auditoria-fecha-hasta'
						type='date'
						value={fechaHasta ?? ''}
						onChange={e => onFechaHastaChange(e.target.value || null)}
						className='w-40'
					/>
				</div>

				<div className='relative min-w-0 flex-1'>
					<Input
						placeholder='Filtrar por IP de origen...'
						value={ipOrigen}
						onChange={e => onIpOrigenChange(e.target.value)}
					/>
				</div>
			</div>

			<p className='mt-3 text-xs text-muted-foreground'>
				Mostrando {totalFiltrados} de {total} registros
			</p>
		</>
	)
}
