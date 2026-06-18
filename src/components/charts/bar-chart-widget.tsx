'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { colorSegmento } from '@/lib/paleta-dashboard'

type BarConfig = {
  key: string
  color?: string
  name?: string
}

type BarChartWidgetProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  xKey: string
  bars: BarConfig[]
  height?: number
}

export default function BarChartWidget({
  data,
  xKey,
  bars,
  height = 250,
}: BarChartWidgetProps) {
  return (
    <ResponsiveContainer width='100%' height={height}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
        {bars.length > 1 && (
          <Legend
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
          />
        )}
        {bars.map((bar, i) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.name ?? bar.key}
            fill={bar.color ?? colorSegmento(i)}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
