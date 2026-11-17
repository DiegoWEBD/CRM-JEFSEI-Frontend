'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/card'
import { useFiltrosDashboard } from '../../filtros-dashboard-context'
import {
	MetricaContenidoError,
	MetricaContenidoSkeleton,
} from '../../shared/metrica-card-skeleton'
import { usePrimaNetaMensual } from '@/hooks/metricas/use-prima-neta-mensual'
import { cn } from '@/lib/utils'

export default function MonthlyNetPremiumCardClient() {
	const { mes, year } = useFiltrosDashboard()
	const { data, isLoading, isPlaceholderData, isError } = usePrimaNetaMensual(mes, year)

	const cargando = isLoading || isPlaceholderData

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardContent className='p-3.5'>
				<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
					Prima neta mensual
				</p>
				{cargando ? (
					<MetricaContenidoSkeleton alto={72} lineas={3} className='mt-1' />
				) : isError || !data ? (
					<MetricaContenidoError className='mt-1' />
				) : (
					<>
						<p className='mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-[1.75rem]'>
							{data.total_prima_neta.toLocaleString('es-CL')} UF
						</p>
						<p className='mt-0.5 text-xs text-muted-foreground'>{data.mes_label}</p>
						<p
							className={cn(
								'mt-1.5 inline-flex items-center gap-0.5 text-xs',
								data.variacion_mes_anterior >= 0
									? 'text-emerald-700 dark:text-emerald-300'
									: 'text-amber-700 dark:text-amber-300',
							)}
						>
							{data.variacion_mes_anterior >= 0 ? (
								<TrendingUp className='h-2.5 w-2.5' aria-hidden />
							) : (
								<TrendingDown className='h-2.5 w-2.5' aria-hidden />
							)}
							{data.variacion_mes_anterior >= 0 ? '+' : ''}
							{data.variacion_mes_anterior.toFixed(1)}% vs. mes anterior
						</p>
					</>
				)}
			</CardContent>
		</Card>
	)
}
