'use client'

import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts'
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
import {
  MetricaContenidoError,
  MetricaGraficoSkeleton,
} from '../../shared/metrica-card-skeleton'

function truncarLabel(label: string, max = 16) {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label
}

export function ProductionHorizontalBarChart({
  title,
  description,
  items,
  className,
  axisWidth = 88,
  variant = 'prima',
  loading = false,
  error = false,
}: {
  title: string
  description?: string
  items?: { nombre: string; valor: number }[] | null
  className?: string
  axisWidth?: number
  variant?: 'prima' | 'count'
  /** Muestra el skeleton del gráfico, con el título visible */
  loading?: boolean
  /** Muestra el mensaje de error, con el título visible */
  error?: boolean
}) {
  const chartConfig = {
    valorGrafico: {
      label: variant === 'prima' ? 'Prima neta' : 'Cantidad',
    },
  } satisfies ChartConfig

  const chartData = useMemo(
    () =>
      (Array.isArray(items) ? items : []).map((item) => ({
        label: item.nombre,
        name: truncarLabel(item.nombre),
        prima_neta_total: item.valor,
        valorGrafico: item.valor,
      })),
    [items],
  )

  const altura = Math.max(180, chartData.length * 32)

  return (
    <Card className={cn('border-border bg-card shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md', className)}>
      <CardHeader className='space-y-0 pb-1.5 pt-2.5'>
        <CardTitle className='text-xs font-semibold text-foreground'>{title}</CardTitle>
        {description ? (
          <p className='text-xs text-muted-foreground'>{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className='pb-2.5 pt-0'>
        {loading ? (
          <MetricaGraficoSkeleton alto={220} />
        ) : error ? (
          <MetricaContenidoError />
        ) : chartData.length === 0 ? (
          <p className='py-12 text-center text-xs text-muted-foreground'>
            No hay datos disponibles para este período
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='aspect-auto w-full'
            style={{ height: altura }}
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
                tickFormatter={(v) =>
                  variant === 'count' ? String(v) : chartAxisTickUf(Number(v))
                }
              />
              <YAxis
                type='category'
                dataKey='name'
                tickLine={false}
                axisLine={false}
                width={axisWidth}
                fontSize={10}
              />
              <ChartTooltip
                cursor={{ fill: 'color-mix(in oklab, var(--primary) 8%, transparent)' }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(_label, payload) =>
                      (payload?.[0]?.payload?.label as string | undefined) ?? ''
                    }
                    formatter={(value) =>
                      variant === 'prima' ? formatUF(Number(value)) : Number(value).toLocaleString('es-CL')
                    }
                  />
                }
              />
              <Bar dataKey='valorGrafico' radius={[0, 4, 4, 0]} maxBarSize={16}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.label}
                    fill={variant === 'prima' ? colorSegmento(index) : index === 0 ? 'var(--primary)' : 'color-mix(in oklab, var(--muted-foreground) 28%, transparent)'}
                    fillOpacity={variant === 'prima' ? 0.88 : undefined}
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
