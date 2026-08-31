import { CardContent } from '@/components/card'
import { ProspectoCondominio } from '@/dominio/prospecto-condominio/prospecto-condominio'
import {
	CLASIFICACION_PRELIMINAR_INCENDIO_LABELS,
	MATERIALIDAD_PRINCIPAL_LABELS,
} from '@/lib/materialidades'
import { UBICACION_PISCINA_LABELS } from '@/lib/ubicacion.piscina'
import { cn } from '@/lib/utils'
import { inputPendiente } from '@/utils/input/input-pendiente'
import {
	Building2,
	Calendar,
	FireExtinguisher,
	Flame,
	Home,
	Layers,
	LayoutGrid,
	MapPin,
	Ruler,
	Shield,
	Waves,
	type LucideIcon,
} from 'lucide-react'

type InformacionTecnicaCondominioProps = {
	prospecto: ProspectoCondominio
}

function TecnicaKpiCard({
	icon: Icon,
	label,
	value,
	missing,
	className,
}: {
	icon: LucideIcon
	label: string
	value: string | number | undefined | null | boolean
	missing?: boolean
	className?: string
}) {
	const displayValue =
		value === undefined || value === null || value === ''
			? '—'
			: typeof value === 'boolean'
				? value
					? 'Sí'
					: 'No'
				: String(value)

	return (
		<div
			className={cn(
				'flex items-center gap-3 rounded-lg border px-3 py-2.5',
				missing
					? 'border-amber-300 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30'
					: 'border-border/60 bg-muted/15',
				className,
			)}
		>
			<div
				className={cn(
					'flex h-9 w-9 shrink-0 items-center justify-center rounded-md',
					missing
						? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
						: 'bg-primary/10 text-primary',
				)}
			>
				<Icon className='h-4 w-4' aria-hidden />
			</div>
			<div className='min-w-0'>
				<p className='truncate text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
					{label}
				</p>
				<p
					className={cn(
						'truncate text-sm font-semibold',
						missing ? 'text-amber-700 dark:text-amber-300' : 'text-foreground',
					)}
				>
					{displayValue}
				</p>
			</div>
		</div>
	)
}

export default function InformacionTecnicaCondominio({
	prospecto,
}: InformacionTecnicaCondominioProps) {
	return (
		<CardContent className='p-4'>
			<div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				<TecnicaKpiCard
					icon={Ruler}
					label='Administrador asociado'
					value={prospecto.administrador?.nombre_administrador}
					missing={inputPendiente(
						prospecto.administrador?.nombre_administrador,
					)}
				/>

				<TecnicaKpiCard
					icon={Ruler}
					label='Uso del condominio'
					value={prospecto.uso_del_condominio}
					missing={inputPendiente(prospecto.uso_del_condominio)}
				/>

				<TecnicaKpiCard
					icon={Calendar}
					label='Año construcción'
					value={prospecto.year_construccion}
					missing={inputPendiente(prospecto.year_construccion)}
				/>

				<TecnicaKpiCard
					icon={Ruler}
					label='Materialidad'
					value={
						prospecto.materialidad
							? MATERIALIDAD_PRINCIPAL_LABELS[prospecto.materialidad]
							: undefined
					}
					missing={inputPendiente(prospecto.materialidad)}
				/>

				<TecnicaKpiCard
					icon={Flame}
					label='Clasificación preliminar incendio'
					value={
						prospecto.clasificacion_preliminar_incendio
							? CLASIFICACION_PRELIMINAR_INCENDIO_LABELS[
									prospecto.clasificacion_preliminar_incendio
								]
							: undefined
					}
					missing={inputPendiente(prospecto.clasificacion_preliminar_incendio)}
				/>

				<TecnicaKpiCard
					icon={Calendar}
					label='Cuenta con locales comerciales'
					value={prospecto.tiene_locales_comerciales}
					missing={inputPendiente(prospecto.tiene_locales_comerciales)}
				/>

				<TecnicaKpiCard
					icon={Calendar}
					label='Procesos productivos'
					value={prospecto.procesos_productivos}
					missing={inputPendiente(prospecto.procesos_productivos)}
				/>

				<TecnicaKpiCard
					icon={LayoutGrid}
					label='Total m² construidos'
					value={prospecto.metros_cuadrados?.toLocaleString('es-CL')}
					missing={inputPendiente(prospecto.metros_cuadrados)}
				/>

				<TecnicaKpiCard
					icon={Layers}
					label='Número de pisos'
					value={prospecto.numero_pisos}
					missing={inputPendiente(prospecto.numero_pisos)}
				/>

				<TecnicaKpiCard
					icon={Building2}
					label='Número de torres'
					value={prospecto.numero_torres}
					missing={inputPendiente(prospecto.numero_torres)}
				/>

				<TecnicaKpiCard
					icon={Home}
					label='Cantidad de departamentos'
					value={prospecto.cantidad_departamentos}
					missing={inputPendiente(prospecto.cantidad_departamentos)}
				/>

				<TecnicaKpiCard
					icon={MapPin}
					label='Cantidad de subterráneos'
					value={prospecto.cantidad_subterraneos}
					missing={inputPendiente(prospecto.cantidad_subterraneos)}
				/>

				<TecnicaKpiCard
					icon={Waves}
					label='Piscina'
					value={
						prospecto.tiene_piscina
							? prospecto.ubicacion_piscina
								? UBICACION_PISCINA_LABELS[prospecto.ubicacion_piscina]
								: 'Sí'
							: prospecto.tiene_piscina === false
								? 'No'
								: undefined
					}
					missing={inputPendiente(prospecto.tiene_piscina)}
				/>

				<TecnicaKpiCard
					icon={FireExtinguisher}
					label='Alarma incendio'
					value={prospecto.tiene_alarma_incendio}
					missing={inputPendiente(prospecto.tiene_alarma_incendio)}
				/>

				<TecnicaKpiCard
					icon={Shield}
					label='Sprinklers'
					value={prospecto.tiene_sprinklers}
					missing={inputPendiente(prospecto.tiene_sprinklers)}
				/>

				<TecnicaKpiCard
					icon={Shield}
					label='Valor UF / m² (sin IVA)'
					value={prospecto.uf_por_metro_cuadrado}
					missing={inputPendiente(prospecto.uf_por_metro_cuadrado)}
				/>

				<TecnicaKpiCard
					icon={Shield}
					label='Porcentaje de depreciación'
					value={
						prospecto.porcentaje_depreciacion != undefined
							? `${prospecto.porcentaje_depreciacion * 100}%`
							: null
					}
					missing={inputPendiente(prospecto.porcentaje_depreciacion)}
				/>

				<TecnicaKpiCard
					icon={Shield}
					label='Porcentaje de espacios comunes'
					value={
						prospecto.porcentaje_espacios_comunes != undefined
							? `${prospecto.porcentaje_espacios_comunes * 100}%`
							: null
					}
					missing={inputPendiente(prospecto.porcentaje_espacios_comunes)}
				/>
			</div>
		</CardContent>
	)
}
