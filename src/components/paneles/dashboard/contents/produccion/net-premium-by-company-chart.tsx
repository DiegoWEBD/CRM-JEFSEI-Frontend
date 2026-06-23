'use client'

import { useMemo } from 'react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	XAxis,
	YAxis,
	ResponsiveContainer,
	Tooltip,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { colorSegmento } from '@/lib/paleta-dashboard'
import { chartAxisTickUf, formatUF } from '@/lib/uf'
import { ItemValor } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import { cn } from '@/lib/utils'

function TooltipCompania({
	active,
	payload,
}: {
	active?: boolean
	payload?: { payload: { nombre: string; valor: number } }[]
}) {
	if (!active || !payload?.[0]?.payload) return null
	const p = payload[0].payload
	return (
		<div className='rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md'>
			<p className='font-semibold text-foreground'>{p.nombre}</p>
			<p className='mt-0.5 tabular-nums text-muted-foreground'>
				Prima neta: {formatUF(p.valor)}
			</p>
		</div>
	)
}

type NetPremiumByCompanyChartProps = {
	data: ItemValor[]
	className?: string
}

export default function NetPremiumByCompanyChart({
	data,
	className,
}: NetPremiumByCompanyChartProps) {
	const chartData = useMemo(
		() =>
			data.map(d => ({
				nombre: d.nombre,
				name: d.nombre.length > 14 ? `${d.nombre.slice(0, 13)}…` : d.nombre,
				valor: d.valor,
			})),
		[data],
	)

	if (chartData.length === 0) {
		return (
			<Card className={cn('border-border bg-card shadow-none', className)}>
				<CardHeader className='space-y-0 pb-1.5 pt-2.5'>
					<CardTitle className='text-xs font-semibold text-foreground'>
						Prima neta por compañía
					</CardTitle>
				</CardHeader>
				<CardContent className='py-12 text-center text-xs text-muted-foreground'>
					No hay datos disponibles para este período
				</CardContent>
			</Card>
		)
	}

	const alturaGrafico = Math.max(200, chartData.length * 36)
	console.log(chartData)

	return (
		<Card className={cn('border-border bg-card shadow-none', className)}>
			<CardHeader className='space-y-0 pb-1.5 pt-2.5'>
				<CardTitle className='text-xs font-semibold text-foreground'>
					Prima neta por compañía
				</CardTitle>
			</CardHeader>
			<CardContent className='pb-0 pt-0'>
				<div className='w-full' style={{ height: alturaGrafico }}>
					<ResponsiveContainer width='100%' height='100%'>
						<BarChart
							data={chartData}
							layout='vertical'
							margin={{ top: 2, right: 8, left: 2, bottom: 2 }}
						>
							<CartesianGrid
								horizontal={false}
								strokeDasharray='3 3'
								className='stroke-teal-500/10'
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
							<Tooltip
								content={<TooltipCompania />}
								cursor={{ fill: 'rgba(20, 184, 166, 0.12)' }}
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
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	)
}
