'use client'

import {
	AlertCircle,
	Calendar,
	CheckCircle2,
	Clock,
	CreditCard,
	PhoneCall,
} from 'lucide-react'
import CardKpi from '@/components/paneles/ejecutivo-comercial/cards/card-kpi/card-kpi'
import { ColumnaCobranza } from '@/dominio/cobranza/dashboard-cobranza'

type KpiCobranzaProps = {
	kpis: Record<ColumnaCobranza, number>
	onKpiClick: (columna: ColumnaCobranza) => void
}

export default function KpiCobranza({ kpis, onKpiClick }: KpiCobranzaProps) {
	const kpiData: {
		key: ColumnaCobranza
		label: string
		icon: typeof Calendar
		accentClassName: string
		iconClassName: string
	}[] = [
		{
			key: 'proximos10',
			label: 'Contactar próximos 10 días',
			icon: Calendar,
			accentClassName: 'border-sky-500/30 bg-sky-500/[0.05]',
			iconClassName: 'text-sky-600 dark:text-sky-400',
		},
		{
			key: 'llamarHoy',
			label: 'Llamar hoy',
			icon: PhoneCall,
			accentClassName: 'border-violet-500/30 bg-violet-500/[0.05]',
			iconClassName: 'text-violet-600 dark:text-violet-400',
		},
		{
			key: 'atrasados',
			label: 'Atrasados (≤30 días)',
			icon: Clock,
			accentClassName: 'border-amber-500/30 bg-amber-500/[0.05]',
			iconClassName: 'text-amber-600 dark:text-amber-400',
		},
		{
			key: 'sinPlanPago',
			label: 'Sin plan de pago',
			icon: CreditCard,
			accentClassName: 'border-gray-500/30 bg-gray-500/[0.05]',
			iconClassName: 'text-gray-600 dark:text-gray-400',
		},
		{
			key: 'morosos',
			label: 'Morosos (+30 días)',
			icon: AlertCircle,
			accentClassName: 'border-red-500/30 bg-red-500/[0.05]',
			iconClassName: 'text-red-600 dark:text-red-400',
		},
		{
			key: 'pagados',
			label: 'Pagados',
			icon: CheckCircle2,
			accentClassName: 'border-emerald-500/30 bg-emerald-500/[0.05]',
			iconClassName: 'text-emerald-600 dark:text-emerald-400',
		},
	]

	return (
		<div className='grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
			{kpiData.map(k => (
				<CardKpi
					key={k.key}
					datos={{
						key: k.key,
						label: k.label,
						value: kpis[k.key],
						icon: k.icon,
					}}
					setKpiAbierto={v => onKpiClick(v as ColumnaCobranza)}
					accentClassName={k.accentClassName}
					iconClassName={k.iconClassName}
				/>
			))}
		</div>
	)
}
