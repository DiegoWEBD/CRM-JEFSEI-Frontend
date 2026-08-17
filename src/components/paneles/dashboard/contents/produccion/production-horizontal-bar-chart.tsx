'use client'

import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { colorSegmento } from '@/lib/paleta-dashboard'
import { chartAxisTickUf, formatUF } from '@/lib/uf'
import { cn } from '@/lib/utils'

function truncarLabel(label: string, max = 16) {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label
}

function TooltipBarra({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: { name: string; label: string; prima_neta_total: number } }[]
}) {
  if (!active || !payload?.[0]?.payload) return null
  const p = payload[0].payload
  return (
    <div className='rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md'>
      <p className='font-semibold text-foreground'>{p.label}</p>
      <p className='mt-0.5 tabular-nums text-muted-foreground'>
        Prima neta: {formatUF(p.prima_neta_total)}
      </p>
    </div>
  )
}

export function ProductionHorizontalBarChart({
  title,
  description,
  items,
  className,
  axisWidth = 88,
  variant = 'prima',
}: {
  title: string
  description?: string
  items?: { nombre: string; valor: number }[] | null
  className?: string
  axisWidth?: number
  variant?: 'prima' | 'count'
}) {
  const safeItems = Array.isArray(items) ? items : []
  const chartData = useMemo(
    () =>
      safeItems.map((item) => ({
        label: item.nombre,
        name: truncarLabel(item.nombre),
        prima_neta_total: item.valor,
        valorGrafico: item.valor,
      })),
    [safeItems],
  )

  if (chartData.length === 0) {
    return (
      <Card className={cn('border-border bg-card shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md', className)}>
        <CardContent className='py-12 text-center text-xs text-muted-foreground'>
          No hay datos disponibles para este período
        </CardContent>
      </Card>
    )
  }

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
        <div className='w-full' style={{ height: altura }}>
          <ResponsiveContainer width='100%' height={altura}>
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
              <Tooltip
                content={<TooltipBarra />}
                cursor={{ fill: 'hsl(var(--primary) / 0.08)' }}
              />
              <Bar dataKey='valorGrafico' radius={[0, 4, 4, 0]} maxBarSize={16}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.label}
                    fill={variant === 'prima' ? colorSegmento(index) : index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.28)'}
                    fillOpacity={variant === 'prima' ? 0.88 : undefined}
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
