'use client'

import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { cn } from '@/lib/utils'
import { colorSegmento } from '@/lib/paleta-dashboard'

function TooltipGestiones({
  active,
  payload,
  barColor,
}: {
  active?: boolean
  payload?: { payload: { label: string; value: number } }[]
  barColor?: string
}) {
  if (!active || !payload?.[0]?.payload) return null
  const p = payload[0].payload
  const accent = barColor ?? '#14b8a6'
  return (
    <div
      className='rounded-lg border bg-popover px-3 py-2 text-xs shadow-md'
      style={{
        borderColor: `${accent}44`,
        boxShadow: `0 4px 12px ${accent}18`,
      }}
    >
      <p className='font-semibold text-foreground'>{p.label}</p>
      <p className='mt-0.5 tabular-nums' style={{ color: accent }}>
        {p.value.toLocaleString('es-CL')} gestiones
      </p>
    </div>
  )
}

export default function CommercialActivitiesBarChart({
  data,
  className,
}: {
  data: { label: string; value: number }[]
  className?: string
}) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        name: d.label,
        cantidad: d.value,
        label: d.label,
        value: d.value,
      })),
    [data],
  )

  if (chartData.length === 0 || chartData.every((d) => d.cantidad === 0)) {
    return (
      <Card className={cn('border-border bg-card shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md', className)}>
        <CardContent className='py-12 text-center text-xs text-muted-foreground'>
          Sin gestiones en el per&iacute;odo seleccionado.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('border-border bg-card shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md', className)}>
      <CardHeader className='space-y-0 pb-1.5 pt-2.5'>
        <CardTitle className='text-xs font-semibold text-foreground'>Gestiones por tipo</CardTitle>
      </CardHeader>
      <CardContent className='pb-2.5 pt-0'>
        <div className='h-[200px] w-full sm:h-[210px]'>
          <ResponsiveContainer width='100%' height={210}>
            <BarChart
              data={chartData}
              margin={{ top: 6, right: 6, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray='3 3' className='stroke-teal-500/10' />
              <XAxis
                dataKey='name'
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                fontSize={10}
                interval={0}
                angle={-18}
                textAnchor='end'
                height={48}
              />
              <YAxis tickLine={false} axisLine={false} width={28} fontSize={10} allowDecimals={false} />
              <Bar dataKey='cantidad' radius={[4, 4, 0, 0]} maxBarSize={32}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={colorSegmento(index)}
                    fillOpacity={0.88}
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
