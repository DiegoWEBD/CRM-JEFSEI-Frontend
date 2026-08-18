import ChipFiltro from '@/components/chip-filtro/chip-filtro'
import Select from '@/components/forms/select/select'
import SelectContent from '@/components/forms/select/select-content/select-content'
import SelectItem from '@/components/forms/select/select-item/select-item'
import SelectTrigger from '@/components/forms/select/select-trigger/select-trigger'
import SelectValue from '@/components/forms/select/select-value/select-value'
import { useFiltrosProspectos } from '@/hooks/prospectos/use-filtros-prospectos'
import {
	ESTADO_PROSPECTO_LABELS,
	ESTADOS_PROSPECTO,
} from '@/types/estados/estado-comercial-cliente'

type FiltrosEstadoProspectoProps = {
	contadoresEstado: Record<string, number>
	total: number
	filtroActivo: string
	onFiltroChange: (valor: string) => void
}

export function FiltrosEstadoProspecto({
	contadoresEstado,
	total,
	filtroActivo,
	onFiltroChange,
}: FiltrosEstadoProspectoProps) {
	const labelSelectActivo =
		filtroActivo === 'todos'
			? 'Estado comercial'
			: ESTADO_PROSPECTO_LABELS[
					filtroActivo as keyof typeof ESTADO_PROSPECTO_LABELS
				] ?? 'Estado comercial'

	const { contadores } = useFiltrosProspectos(contadoresEstado)

	return (
		<div className='space-y-1.5'>
			<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
				Estado comercial
			</p>

			{/* Móvil: selector compacto */}
			<div className='sm:hidden'>
				<Select
					value={filtroActivo}
					onValueChange={onFiltroChange}
				>
					<SelectTrigger className='h-9 w-full text-xs shadow-none'>
						<SelectValue>{labelSelectActivo}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='todos' className='text-xs'>
							Todos ({total})
						</SelectItem>
						{ESTADOS_PROSPECTO.map(est => (
							<SelectItem key={est} value={est} className='text-xs'>
								{ESTADO_PROSPECTO_LABELS[est]} ({contadores.get(est) ?? 0})
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
					count={total}
				/>
				{ESTADOS_PROSPECTO.map(est => (
					<ChipFiltro
						key={est}
						activo={filtroActivo === est}
						onClick={() => onFiltroChange(est)}
						label={ESTADO_PROSPECTO_LABELS[est]}
						count={contadores.get(est) ?? 0}
					/>
				))}
			</div>
		</div>
	)
}
