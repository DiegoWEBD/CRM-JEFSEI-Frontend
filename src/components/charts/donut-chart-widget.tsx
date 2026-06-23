'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { colorDonut } from '@/lib/paleta-dashboard'

type DonutChartWidgetProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  nameKey: string
  dataKey: string
  height?: number
  innerRadius?: number
  outerRadius?: number
}

export default function DonutChartWidget({
  data,
  nameKey,
  dataKey,
  height = 250,
  innerRadius = 60,
  outerRadius = 100,
}: DonutChartWidgetProps) {
  return (
    <ResponsiveContainer width='100%' height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx='50%'
          cy='50%'
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colorDonut(index)} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid hsl(var(--border))',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            fontSize: '12px',
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
          iconType='circle'
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
