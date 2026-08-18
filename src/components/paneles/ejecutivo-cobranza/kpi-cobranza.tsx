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
import { KPI_PASTEL } from '@/lib/kpi-pastel'

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
			accentClassName: KPI_PASTEL.sky.card,
			iconClassName: KPI_PASTEL.sky.icon,
		},
		{
			key: 'llamarHoy',
			label: 'Llamar hoy',
			icon: PhoneCall,
			accentClassName: KPI_PASTEL.violet.card,
			iconClassName: KPI_PASTEL.violet.icon,
		},
		{
			key: 'atrasados',
			label: 'Atrasados (≤30 días)',
			icon: Clock,
			accentClassName: KPI_PASTEL.warning.card,
			iconClassName: KPI_PASTEL.warning.icon,
		},
		{
			key: 'sinPlanPago',
			label: 'Sin plan de pago',
			icon: CreditCard,
			accentClassName: KPI_PASTEL.slate.card,
			iconClassName: KPI_PASTEL.slate.icon,
		},
		{
			key: 'morosos',
			label: 'Morosos (+30 días)',
			icon: AlertCircle,
			accentClassName: KPI_PASTEL.danger.card,
			iconClassName: KPI_PASTEL.danger.icon,
		},
		{
			key: 'pagados',
			label: 'Pagados',
			icon: CheckCircle2,
			accentClassName: KPI_PASTEL.success.card,
			iconClassName: KPI_PASTEL.success.icon,
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
					onClick={v => onKpiClick(v as ColumnaCobranza)}
					accentClassName={k.accentClassName}
					iconClassName={k.iconClassName}
				/>
			))}
		</div>
	)
}
