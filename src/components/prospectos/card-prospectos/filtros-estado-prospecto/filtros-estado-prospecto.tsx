'use client'

import ChipFiltro from '@/components/chip-filtro/chip-filtro'
import Select from '@/components/forms/select/select'
import SelectContent from '@/components/forms/select/select-content/select-content'
import SelectItem from '@/components/forms/select/select-item/select-item'
import SelectTrigger from '@/components/forms/select/select-trigger/select-trigger'
import SelectValue from '@/components/forms/select/select-value/select-value'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover'
import { useFiltrosProspectos } from '@/hooks/prospectos/use-filtros-prospectos'
import { classname } from '@/lib/class-name'
import {
	ESTADO_PROSPECTO_LABELS,
	ESTADOS_PROSPECTO,
	type EstadoComercialProspecto,
} from '@/types/estados/estado-comercial-cliente'
import { Check, ChevronDown, SlidersHorizontal } from 'lucide-react'

type FiltrosEstadoProspectoProps = {
	contadoresEstado: Record<string, number>
	total: number
	filtroActivo: string
	onFiltroChange: (valor: string) => void
}

const ESTADOS_PRINCIPALES: EstadoComercialProspecto[] = [
	'OPORTUNIDAD_CREADA',
	'COTIZACION_SOLICITADA_COMPANY',
	'COTIZACION_DISPONIBLE',
	'ESTUDIO_DISPONIBLE',
]

const GRUPOS_ESTADOS: {
	titulo: string
	estados: EstadoComercialProspecto[]
}[] = [
	{
		titulo: 'Estudios',
		estados: ['ESTUDIO_ENVIADO_CLIENTE', 'RECOTIZACION_SOLICITADA'],
	},
	{
		titulo: 'Cierre',
		estados: ['PROPUESTA_ACEPTADA', 'GANADO', 'PERDIDO'],
	},
	{
		titulo: 'Otros',
		estados: ['POLIZA_REGISTRADA', 'PLAN_PAGO_CREADO'],
	},
]

export function FiltrosEstadoProspecto({
	contadoresEstado,
	total,
	filtroActivo,
	onFiltroChange,
}: FiltrosEstadoProspectoProps) {
	const labelSelectActivo =
		filtroActivo === 'todos'
			? 'Estado comercial'
			: (ESTADO_PROSPECTO_LABELS[
					filtroActivo as keyof typeof ESTADO_PROSPECTO_LABELS
				] ?? 'Estado comercial')

	const { contadores } = useFiltrosProspectos(contadoresEstado)

	const esFiltroSecundario =
		filtroActivo !== 'todos' &&
		!ESTADOS_PRINCIPALES.includes(filtroActivo as EstadoComercialProspecto)

	const labelFiltroSecundarioActivo = esFiltroSecundario
		? (ESTADO_PROSPECTO_LABELS[
				filtroActivo as keyof typeof ESTADO_PROSPECTO_LABELS
			] ?? filtroActivo)
		: null

	return (
		<div className='space-y-1.5'>
			<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
				Estado comercial
			</p>

			{/* Móvil: selector compacto */}
			<div className='sm:hidden'>
				<Select value={filtroActivo} onValueChange={onFiltroChange}>
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

			{/* Desktop: chips principales + popover de estados restantes */}
			<div
				className='hidden flex-wrap items-center gap-1.5 sm:flex'
				role='group'
				aria-label='Filtrar por estado comercial'
			>
				<ChipFiltro
					activo={filtroActivo === 'todos'}
					onClick={() => onFiltroChange('todos')}
					label='Todos'
					count={total}
				/>
				{ESTADOS_PRINCIPALES.map(est => (
					<ChipFiltro
						key={est}
						activo={filtroActivo === est}
						onClick={() => onFiltroChange(est)}
						label={ESTADO_PROSPECTO_LABELS[est]}
						count={contadores.get(est) ?? 0}
					/>
				))}

				<Popover>
					<PopoverTrigger asChild>
						<button
							type='button'
							className={classname(
								'hover:cursor-pointer inline-flex h-7 max-w-full items-center gap-1 rounded-full border px-2.5 text-xs font-medium transition-colors',
								esFiltroSecundario
									? 'border-primary bg-primary text-primary-foreground shadow-none'
									: 'border-dashed border-border bg-background text-muted-foreground hover:border-solid hover:bg-accent hover:text-accent-foreground',
							)}
						>
							{esFiltroSecundario ? (
								<Check className='h-3 w-3 shrink-0' aria-hidden />
							) : (
								<SlidersHorizontal className='h-3 w-3 shrink-0' aria-hidden />
							)}
							<span className='truncate'>
								{labelFiltroSecundarioActivo ?? 'Más filtros'}
							</span>
							<ChevronDown className='h-3 w-3 shrink-0' aria-hidden />
						</button>
					</PopoverTrigger>
					<PopoverContent align='start' sideOffset={6} className='w-72 p-2'>
						{GRUPOS_ESTADOS.map(grupo => (
							<div key={grupo.titulo} className='space-y-0.5'>
								<p className='px-2 pt-1.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
									{grupo.titulo}
								</p>
								{grupo.estados.map(est => (
									<button
										key={est}
										type='button'
										onClick={() => onFiltroChange(est)}
										className={classname(
											'hover:cursor-pointer flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors',
											filtroActivo === est
												? 'bg-primary/10 font-medium text-primary'
												: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
										)}
									>
										<span className='truncate'>
											{ESTADO_PROSPECTO_LABELS[est]}
										</span>
										<span className='shrink-0 tabular-nums opacity-70'>
											{contadores.get(est) ?? 0}
										</span>
									</button>
								))}
							</div>
						))}
						{esFiltroSecundario && (
							<>
								<hr className='my-1.5 border-border' />
								<button
									type='button'
									onClick={() => onFiltroChange('todos')}
									className='hover:cursor-pointer flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground'
								>
									Limpiar filtro
								</button>
							</>
						)}
					</PopoverContent>
				</Popover>
			</div>
		</div>
	)
}
