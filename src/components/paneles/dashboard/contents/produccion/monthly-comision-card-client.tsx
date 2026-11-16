'use client'

import { Card, CardContent } from '@/components/card'
import { useFiltrosDashboard } from '../../filtros-dashboard-context'
import {
	MetricaCardError,
	MetricaCardSkeleton,
} from '../../shared/metrica-card-skeleton'
import { useComisionMensual } from '@/hooks/metricas/use-comision-mensual'

export default function MonthlyComisionCardClient() {
	const { mes, year } = useFiltrosDashboard()
	const { data, isLoading, isError } = useComisionMensual(mes, year)

	if (isLoading) return <MetricaCardSkeleton />
	if (isError || !data) return <MetricaCardError />

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardContent className='p-3.5'>
				<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
					Comisión mensual
				</p>
				<p className='mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-[1.75rem]'>
					{data.total_comision.toLocaleString('es-CL')} UF
				</p>
				<p className='mt-0.5 text-xs text-muted-foreground'>{data.mes_label}</p>
			</CardContent>
		</Card>
	)
}
