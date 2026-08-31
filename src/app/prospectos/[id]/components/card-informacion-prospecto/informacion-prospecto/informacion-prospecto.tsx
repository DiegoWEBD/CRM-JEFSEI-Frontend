import { CardContent } from '@/components/card'
import { Prospecto } from '@/dominio/prospecto/prospecto'
import { cn } from '@/lib/utils'
import { formatearFecha } from '@/utils/formatear-fecha'
import { inputPendiente } from '@/utils/input/input-pendiente'
import {
	Briefcase,
	Building2,
	Clock,
	CreditCard,
	FileText,
	Map,
	MapPin,
	UserCheck,
	type LucideIcon,
} from 'lucide-react'

type InformacionProspectoProps = {
	prospecto: Prospecto
}

function ProspectoKpiCard({
	icon: Icon,
	label,
	value,
	missing,
	className,
}: {
	icon: LucideIcon
	label: string
	value: string | number | undefined | null
	missing?: boolean
	className?: string
}) {
	const displayValue =
		value === undefined || value === null || value === '' ? '—' : String(value)

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

export default function InformacionProspecto({
	prospecto,
}: InformacionProspectoProps) {
	return (
		<CardContent className='p-4'>
			<div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				<ProspectoKpiCard
					icon={FileText}
					label='Nombre'
					value={prospecto.nombre_riesgo}
					missing={inputPendiente(prospecto.nombre_riesgo)}
					className='sm:col-span-2 lg:col-span-3 xl:col-span-2'
				/>
				<ProspectoKpiCard
					icon={CreditCard}
					label='RUT'
					value={prospecto.rut_riesgo}
					missing={inputPendiente(prospecto.rut_riesgo)}
				/>
				<ProspectoKpiCard
					icon={Briefcase}
					label='Línea de negocio'
					value={prospecto.linea_negocio.nombre}
				/>

				<ProspectoKpiCard
					icon={MapPin}
					label='Dirección'
					value={prospecto.direccion}
					missing={inputPendiente(prospecto.direccion)}
					className='sm:col-span-2 lg:col-span-3 xl:col-span-2'
				/>
				<ProspectoKpiCard
					icon={Map}
					label='Región'
					value={prospecto.region}
					missing={inputPendiente(prospecto.region)}
				/>
				<ProspectoKpiCard
					icon={Building2}
					label='Comuna'
					value={prospecto.comuna}
					missing={inputPendiente(prospecto.comuna)}
				/>

				<ProspectoKpiCard
					icon={UserCheck}
					label='Registrado por'
					value={prospecto.registrado_por.nombre}
				/>

				<ProspectoKpiCard
					icon={Clock}
					label='Última actualización'
					value={formatearFecha(
						new Date(prospecto.ultima_actualizacion),
						'dd MMM yyyy · HH:mm',
					)}
				/>
			</div>
		</CardContent>
	)
}
