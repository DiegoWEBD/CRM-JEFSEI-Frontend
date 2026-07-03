import { ProspectoResumenJson } from '@/aplicacion/prospectos/use-cases/obtener-prospectos/dto/prospecto-resumen-json'
import ChipFiltro from '@/components/chip-filtro/chip-filtro'
import Select from '@/components/forms/select/select'
import SelectContent from '@/components/forms/select/select-content/select-content'
import SelectItem from '@/components/forms/select/select-item/select-item'
import SelectTrigger from '@/components/forms/select/select-trigger/select-trigger'
import SelectValue from '@/components/forms/select/select-value/select-value'
import {
	FiltroEstadoComercialValor,
	useFiltrosProspectos,
} from '@/hooks/prospectos/use-filtros-prospectos'
import { ESTADO_PROSPECTO_LABELS, ESTADOS_PROSPECTO } from '@/types/estados/estado-comercial-cliente'

type FiltrosEstadoProspectoProps = {
	prospectos?: ProspectoResumenJson[]
	filtroActivo: FiltroEstadoComercialValor
	onFiltroChange: (valor: FiltroEstadoComercialValor) => void
}

export function FiltrosEstadoProspecto({
	prospectos,
	filtroActivo,
	onFiltroChange,
}: FiltrosEstadoProspectoProps) {
	const labelSelectActivo =
		filtroActivo === 'todos'
			? 'Estado comercial'
			: ESTADO_PROSPECTO_LABELS[filtroActivo]

	const { filtrosContados } = useFiltrosProspectos(prospectos)

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
						<SelectItem value='todos' className='text-xs'>
							Todos ({prospectos?.length ?? 0})
						</SelectItem>
						{ESTADOS_PROSPECTO.map(est => (
							<SelectItem key={est} value={est} className='text-xs'>
								{ESTADO_PROSPECTO_LABELS[est]} ({filtrosContados.get(est)})
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
					count={prospectos?.length ?? 0}
				/>
				{ESTADOS_PROSPECTO.map(est => (
					<ChipFiltro
						key={est}
						activo={filtroActivo === est}
						onClick={() => onFiltroChange(est)}
						label={ESTADO_PROSPECTO_LABELS[est]}
						count={filtrosContados.get(est) ?? 0}
					/>
				))}
			</div>
		</div>
	)
}
