'use client'

import { useMemo, useState } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import { chartAxisTickUf, formatUF } from '@/lib/uf'
import { TendenciaMes } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import { cn } from '@/lib/utils'

const LINEA_PRIMA_COLOR = 'hsl(var(--foreground))'

function TooltipPrima({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: { mes: string; prima_neta: number } }[]
}) {
  if (!active || !payload?.[0]?.payload) return null
  const p = payload[0].payload
  const sinValor = p.prima_neta <= 0
  return (
    <div className='rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md'>
      <p className='font-medium text-foreground'>{p.mes}</p>
      <p className='tabular-nums text-muted-foreground'>
        {sinValor ? 'Sin registro' : `Prima neta: ${formatUF(p.prima_neta)}`}
      </p>
    </div>
  )
}

function PuntoAnual(props: {
  cx?: number
  cy?: number
  payload?: { prima_neta: number }
}) {
  const { cx, cy, payload } = props
  if (cx == null || cy == null || !payload || payload.prima_neta <= 0) return null
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={LINEA_PRIMA_COLOR}
      stroke='none'
    />
  )
}

type MonthlyNetPremiumTrendChartProps = {
  data: TendenciaMes[]
  className?: string
}

const MESES_LABELS: Record<string, string> = {
  '01': 'Ene', '02': 'Feb', '03': 'Mar', '04': 'Abr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Ago',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dic',
}

export default function MonthlyNetPremiumTrendChart({ data, className }: MonthlyNetPremiumTrendChartProps) {
  const anios = useMemo(() => {
    const s = new Set<string>()
    data.forEach((d) => {
      const a = d.mes.slice(0, 4)
      if (a) s.add(a)
    })
    return Array.from(s).sort()
  }, [data])

  const [anio, setAnio] = useState(() => anios[anios.length - 1] ?? String(new Date().getFullYear()))

  const serie = useMemo(() => {
    return data
      .filter((d) => d.mes.startsWith(anio))
      .map((d) => ({
        ...d,
        monthLabel: MESES_LABELS[d.mes.slice(5, 7)] ?? d.mes.slice(5, 7),
      }))
  }, [data, anio])

  const tieneAlgunDato = serie.some((p) => p.prima_neta > 0)

  return (
    <Card className={cn('border-border bg-card shadow-none', className)}>
      <CardHeader className='flex flex-row items-center justify-between gap-2 space-y-0 pb-1.5 pt-2.5'>
        <CardTitle className='text-xs font-semibold text-foreground'>
          Evolución mensual de prima neta
        </CardTitle>
        <div className='flex shrink-0 items-center gap-1.5'>
          <span className='text-[10px] text-muted-foreground'>Año:</span>
          <Select value={anio} onValueChange={setAnio}>
            <SelectTrigger className='h-7 min-w-[8.25rem] w-[8.75rem] shrink-0 gap-2 border-border/80 px-3 text-xs shadow-none'>
              <SelectValue className='tabular-nums' />
            </SelectTrigger>
            <SelectContent align='end'>
              {anios.map((a) => (
                <SelectItem key={a} value={a} className='text-xs'>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className='pb-2.5 pt-0'>
        {!tieneAlgunDato ? (
          <p className='py-10 text-center text-xs text-muted-foreground'>
            Sin datos de prima neta para {anio}.
          </p>
        ) : (
          <div className='h-[200px] w-full sm:h-[210px]'>
            <ResponsiveContainer width='100%' height={210}>
              <LineChart data={serie} margin={{ top: 12, right: 12, left: 4, bottom: 4 }}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray='3 3'
                  className='stroke-teal-500/10'
                />
                <XAxis
                  dataKey='monthLabel'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={10}
                  interval={0}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={56}
                  fontSize={9}
                  tickFormatter={(v) => chartAxisTickUf(Number(v))}
                />
                <Tooltip content={<TooltipPrima />} cursor={{ stroke: 'hsl(var(--border))' }} />
                <Line
                  type='monotone'
                  dataKey='prima_neta'
                  stroke={LINEA_PRIMA_COLOR}
                  strokeWidth={2.5}
                  dot={<PuntoAnual />}
                  activeDot={{ r: 5, fill: LINEA_PRIMA_COLOR, stroke: 'none' }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
