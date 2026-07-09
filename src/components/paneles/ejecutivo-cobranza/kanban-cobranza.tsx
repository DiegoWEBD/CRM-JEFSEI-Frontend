'use client'

import { useMemo } from 'react'
import {
	AlertCircle,
	Calendar,
	CheckCircle2,
	Clock,
	CreditCard,
	PhoneCall,
} from 'lucide-react'
import {
	ColumnaCobranza,
	CuotaDashboard,
	DashboardCobranza,
	PolizaSinPlanPago,
} from '@/dominio/cobranza/dashboard-cobranza'
import { cn } from '@/lib/utils'
import ItemCobranza from './item-cobranza'

type KanbanCobranzaProps = {
	dashboard: DashboardCobranza
	onRegistrarPago?: (cuota: CuotaDashboard) => void
}

type ColumnaConfig = {
	key: ColumnaCobranza
	label: string
	icon: typeof Calendar
	bgColor: string
	headerBorder: string
	mapKey: keyof DashboardCobranza
	isPolizaColumn: boolean
}

const COLUMNAS: ColumnaConfig[] = [
	{
		key: 'proximos10',
		label: 'Contactar próximos 10 días',
		icon: Calendar,
		bgColor: 'bg-sky-500/[0.04]',
		headerBorder: 'border-sky-500/30',
		mapKey: 'proximos10',
		isPolizaColumn: false,
	},
	{
		key: 'llamarHoy',
		label: 'Llamar hoy',
		icon: PhoneCall,
		bgColor: 'bg-violet-500/[0.04]',
		headerBorder: 'border-violet-500/30',
		mapKey: 'llamar_hoy',
		isPolizaColumn: false,
	},
	{
		key: 'atrasados',
		label: 'Atrasados',
		icon: Clock,
		bgColor: 'bg-amber-500/[0.04]',
		headerBorder: 'border-amber-500/30',
		mapKey: 'atrasados',
		isPolizaColumn: false,
	},
	{
		key: 'sinPlanPago',
		label: 'Sin plan de pago',
		icon: CreditCard,
		bgColor: 'bg-gray-500/[0.04]',
		headerBorder: 'border-gray-500/30',
		mapKey: 'sin_plan_pago',
		isPolizaColumn: true,
	},
	{
		key: 'morosos',
		label: 'Morosos',
		icon: AlertCircle,
		bgColor: 'bg-red-500/[0.04]',
		headerBorder: 'border-red-500/30',
		mapKey: 'morosos',
		isPolizaColumn: false,
	},
	{
		key: 'pagados',
		label: 'Pagados',
		icon: CheckCircle2,
		bgColor: 'bg-emerald-500/[0.04]',
		headerBorder: 'border-emerald-500/30',
		mapKey: 'pagados',
		isPolizaColumn: false,
	},
]

export default function KanbanCobranza({
	dashboard,
	onRegistrarPago,
}: KanbanCobranzaProps) {
	const columnasConDatos = useMemo(
		() =>
			COLUMNAS.map(col => ({
				...col,
				items: (dashboard[col.mapKey] ?? []) as (
					| CuotaDashboard
					| PolizaSinPlanPago
				)[],
			})),
		[dashboard],
	)

	return (
		<div className='-mx-3 overflow-x-auto px-3 sm:-mx-4 sm:px-4 lg:mx-0 lg:px-0'>
			<div
				className='flex gap-3 lg:grid lg:grid-cols-3 xl:grid-cols-6'
				style={{ minWidth: '640px' }}
			>
				{columnasConDatos.map(columna => {
					const Icon = columna.icon
					return (
						<div
							key={columna.key}
							className={cn(
								'flex w-64 shrink-0 flex-col rounded-lg border border-border/60 lg:w-auto',
								columna.bgColor,
							)}
						>
							<div
								className={cn(
									'flex items-center gap-2 border-b px-3 py-2',
									columna.headerBorder,
								)}
							>
								<Icon className='h-4 w-4 text-muted-foreground' aria-hidden />
								<span className='text-xs font-semibold leading-snug text-foreground'>
									{columna.label}
								</span>
								<span className='ml-auto text-[10px] font-medium tabular-nums text-muted-foreground'>
									{columna.items.length}
								</span>
							</div>

							<div className='flex-1 space-y-2 overflow-y-auto p-2'>
								{columna.items.length === 0 ? (
									<p className='py-8 text-center text-[10px] text-muted-foreground'>
										Sin elementos
									</p>
								) : (
									columna.items.map((item, idx) => (
										<ItemCobranza
											key={
												'numero_cuota' in item
													? item.id
													: item.numero_poliza + '_' + idx
											}
											item={item}
											onRegistrarPago={
												!columna.isPolizaColumn ? onRegistrarPago : undefined
											}
										/>
									))
								)}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
