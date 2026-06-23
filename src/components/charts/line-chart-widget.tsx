'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { colorSegmento } from '@/lib/paleta-dashboard'

type LineChartWidgetProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  xKey: string
  yKey: string
  color?: string
  height?: number
}

export default function LineChartWidget({
  data,
  xKey,
  yKey,
  color,
  height = 250,
}: LineChartWidgetProps) {
  return (
    <ResponsiveContainer width='100%' height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11 }}
          className='text-muted-foreground'
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          className='text-muted-foreground'
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid hsl(var(--border))',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            fontSize: '12px',
          }}
        />
        <Line
          type='monotone'
          dataKey={yKey}
          stroke={color ?? colorSegmento(0)}
          strokeWidth={2}
          dot={{ r: 3, fill: color ?? colorSegmento(0) }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
