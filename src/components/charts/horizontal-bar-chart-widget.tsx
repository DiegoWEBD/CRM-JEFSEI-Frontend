'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { colorSegmento } from '@/lib/paleta-dashboard'

type HorizontalBarChartWidgetProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  yKey: string
  xKey: string
  color?: string
  height?: number
}

export default function HorizontalBarChartWidget({
  data,
  yKey,
  xKey,
  color,
  height = 250,
}: HorizontalBarChartWidgetProps) {
  return (
    <ResponsiveContainer width='100%' height={height}>
      <BarChart
        data={data}
        layout='vertical'
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
        <XAxis type='number' tick={{ fontSize: 11 }} className='text-muted-foreground' axisLine={false} tickLine={false} />
        <YAxis
          type='category'
          dataKey={yKey}
          tick={{ fontSize: 11 }}
          className='text-muted-foreground'
          axisLine={false}
          tickLine={false}
          width={100}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid hsl(var(--border))',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            fontSize: '12px',
          }}
        />
        <Bar
          dataKey={xKey}
          fill={color ?? colorSegmento(0)}
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
