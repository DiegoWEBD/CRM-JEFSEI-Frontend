'use client'

import { useMemo } from 'react'

import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	XAxis,
	YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from '@/components/chart'
import { colorSegmento } from '@/lib/paleta-dashboard'
import { chartAxisTickUf, formatUF } from '@/lib/uf'
import { cn } from '@/lib/utils'
import { useFiltrosDashboard } from '../../filtros-dashboard-context'
import {
	MetricaContenidoError,
	MetricaGraficoSkeleton,
} from '../../shared/metrica-card-skeleton'
import { usePrimaPorCompania } from '@/hooks/metricas/use-prima-por-compania'

const chartConfig = {
	valor: {
		label: 'Prima neta',
	},
} satisfies ChartConfig

type NetPremiumByCompanyChartClientProps = {
	className?: string
}

export default function NetPremiumByCompanyChartClient({
	className,
}: NetPremiumByCompanyChartClientProps) {
	const { mes, year } = useFiltrosDashboard()
	const { data, isLoading, isPlaceholderData, isError } = usePrimaPorCompania(mes, year)

	const cargando = isLoading || isPlaceholderData

	const chartData = useMemo(
		() =>
			(data ?? []).map(d => ({
				nombre: d.nombre,
				name: d.nombre.length > 14 ? `${d.nombre.slice(0, 13)}…` : d.nombre,
				valor: d.valor,
			})),
		[data],
	)

	const alturaGrafico = Math.max(200, chartData.length * 36)

	return (
		<Card className={cn('border-border bg-card shadow-none', className)}>
			<CardHeader className='space-y-0 pb-1.5 pt-2.5'>
				<CardTitle className='text-xs font-semibold text-foreground'>
					Prima neta por compañía
				</CardTitle>
			</CardHeader>
			<CardContent className='pb-0 pt-0'>
				{cargando ? (
					<MetricaGraficoSkeleton alto={220} />
				) : isError || !data ? (
					<MetricaContenidoError />
				) : chartData.length === 0 ? (
					<p className='py-12 text-center text-xs text-muted-foreground'>
						No hay datos disponibles para este período
					</p>
				) : (
					<ChartContainer
						config={chartConfig}
						className='aspect-auto w-full'
						style={{ height: alturaGrafico }}
					>
						<BarChart
							data={chartData}
							layout='vertical'
							margin={{ top: 2, right: 8, left: 2, bottom: 2 }}
						>
							<CartesianGrid
								horizontal={false}
								strokeDasharray='3 3'
								className='stroke-border'
							/>
							<XAxis
								type='number'
								tickLine={false}
								axisLine={false}
								fontSize={10}
								tickFormatter={v => chartAxisTickUf(v)}
							/>
							<YAxis
								type='category'
								dataKey='name'
								tickLine={false}
								axisLine={false}
								width={72}
								fontSize={10}
							/>
							<ChartTooltip
								cursor={{ fill: 'color-mix(in oklab, var(--primary) 8%, transparent)' }}
								content={
									<ChartTooltipContent
										labelFormatter={(_label, payload) =>
											(payload?.[0]?.payload?.nombre as string | undefined) ?? ''
										}
										formatter={value => formatUF(Number(value))}
									/>
								}
							/>
							<Bar dataKey='valor' radius={[0, 4, 4, 0]} maxBarSize={16}>
								{chartData.map((entry, index) => (
									<Cell
										key={entry.nombre}
										fill={colorSegmento(index)}
										fillOpacity={index === 0 ? 1 : 0.88}
									/>
								))}
							</Bar>
						</BarChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	)
}
