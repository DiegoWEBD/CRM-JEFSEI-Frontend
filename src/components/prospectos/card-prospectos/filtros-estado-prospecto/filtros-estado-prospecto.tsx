import ChipFiltro from '@/components/chip-filtro/chip-filtro'
import Select from '@/components/forms/select/select'
import SelectContent from '@/components/forms/select/select-content/select-content'
import SelectItem from '@/components/forms/select/select-item/select-item'
import SelectTrigger from '@/components/forms/select/select-trigger/select-trigger'
import SelectValue from '@/components/forms/select/select-value/select-value'
import { FiltroEstadoComercialValor } from '@/hooks/prospectos/use-filtros-prospectos'
import {
	ESTADO_PROSPECTO_LABELS,
	ESTADOS_PROSPECTO,
} from '@/types/estados/estado-comercial-cliente'
import { useMemo } from 'react'

type FiltrosEstadoProspectoProps = {
	filtroActivo: FiltroEstadoComercialValor
	onFiltroChange: (valor: FiltroEstadoComercialValor) => void
	contarFiltro: (value: FiltroEstadoComercialValor) => number
}

export function FiltrosEstadoProspecto({
	filtroActivo,
	onFiltroChange,
	contarFiltro,
}: FiltrosEstadoProspectoProps) {
	const opcionesSelect: {
		value: FiltroEstadoComercialValor
		label: string
		count: number
	}[] = useMemo(
		() => [
			{ value: 'todos', label: 'Todos', count: 12 },
			...ESTADOS_PROSPECTO.map(estado => ({
				value: estado,
				label: ESTADO_PROSPECTO_LABELS[estado],
				count: contarFiltro(estado),
			})),
		],
		[contarFiltro],
	)

	const labelSelectActivo =
		opcionesSelect.find(o => o.value === filtroActivo)?.label ??
		'Estado comercial'

	return (
		<div className='space-y-1.5'>
			<p className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
				Estado comercial
			</p>

			{/* Móvil: selector compacto */}
			<div className='sm:hidden'>
				<Select
					value={filtroActivo}
					onValueChange={v => onFiltroChange(v as FiltroEstadoComercialValor)}
				>
					<SelectTrigger className='h-9 w-full text-xs shadow-none'>
						<SelectValue>
							{labelSelectActivo}
							{/*filtroActivo === 'todos'
								? conteos.todos
								: conteos.porEstado[filtroActivo as EstadoComercialCliente]*/}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{opcionesSelect.map(o => (
							<SelectItem key={o.value} value={o.value} className='text-xs'>
								{o.label} ({o.count})
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Desktop */}
			<div
				className='hidden flex-wrap gap-1.5 sm:flex'
				role='group'
				aria-label='Filtrar por estado comercial'
			>
				<ChipFiltro
					activo={filtroActivo === 'todos'}
					onClick={() => onFiltroChange('todos')}
					label='Todos'
					count={1}
				/>
				{ESTADOS_PROSPECTO.map(est => (
					<ChipFiltro
						key={est}
						activo={filtroActivo === est}
						onClick={() => onFiltroChange(est)}
						label={ESTADO_PROSPECTO_LABELS[est]}
						count={1}
					/>
				))}
			</div>
		</div>
	)
}
