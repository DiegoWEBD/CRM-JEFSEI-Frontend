'use client'

import { Card, CardContent } from '@/components/card'
import { useFiltrosDashboard } from '../../filtros-dashboard-context'
import {
	MetricaContenidoError,
	MetricaContenidoSkeleton,
} from '../../shared/metrica-card-skeleton'
import { useComisionMensual } from '@/hooks/metricas/use-comision-mensual'

export default function MonthlyComisionCardClient() {
	const { mes, year } = useFiltrosDashboard()
	const { data, isLoading, isPlaceholderData, isError } = useComisionMensual(mes, year)

	const cargando = isLoading || isPlaceholderData

	return (
		<Card className='border-border bg-card shadow-none'>
			<CardContent className='p-3.5'>
				<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
					Comisión mensual
				</p>
				{cargando ? (
					<MetricaContenidoSkeleton alto={72} lineas={2} className='mt-1' />
				) : isError || !data ? (
					<MetricaContenidoError className='mt-1' />
				) : (
					<>
						<p className='mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-[1.75rem]'>
							{data.total_comision.toLocaleString('es-CL')} UF
						</p>
						<p className='mt-0.5 text-xs text-muted-foreground'>{data.mes_label}</p>
					</>
				)}
			</CardContent>
		</Card>
	)
}
