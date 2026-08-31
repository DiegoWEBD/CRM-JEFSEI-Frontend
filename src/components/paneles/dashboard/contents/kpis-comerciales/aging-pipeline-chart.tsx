'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { KpisComercialesJson } from '@/aplicacion/metricas/use-cases/obtener-kpis-comerciales/dto/kpis-comerciales-json'

type AgingPipelineChartProps = {
  data: KpisComercialesJson['aging_pipeline']
}

export default function AgingPipelineChart({ data }: AgingPipelineChartProps) {
  const chartData = useMemo(() => {
    return data.rangos.map((r) => ({
      rango: r.rango,
      cantidad: r.cantidad,
      porcentaje: r.porcentaje,
    }))
  }, [data.rangos])

  return (
    <Card className='border-border bg-card shadow-none'>
      <CardHeader className='pb-1.5 pt-2.5'>
        <CardTitle className='text-xs font-semibold text-foreground'>
          Aging del pipeline
        </CardTitle>
        <p className='text-xs text-muted-foreground'>
          {data.total_abiertos} oportunidades abiertas
        </p>
      </CardHeader>
      <CardContent className='pb-2.5 pt-0'>
        <ResponsiveContainer width='100%' height={200}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
            <XAxis
              dataKey='rango'
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
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any, _name: any, props: any) => [
                `${value} (${props.payload.porcentaje.toFixed(1)}%)`,
                'Oportunidades',
              ]}
            />
            <Bar dataKey='cantidad' fill='hsl(var(--primary))' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
