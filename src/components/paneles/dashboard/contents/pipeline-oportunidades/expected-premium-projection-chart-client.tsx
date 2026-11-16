'use client'

import { useMemo } from 'react'
import { CartesianGrid, Area, AreaChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { chartAxisTickUf, formatUF } from '@/lib/uf'
import { cn } from '@/lib/utils'
import {
  MetricaCardError,
  MetricaCardSkeleton,
} from '../../shared/metrica-card-skeleton'
import { useProyeccionPrimaEsperada } from '@/hooks/metricas/use-proyeccion-prima-esperada'

const LINEA_PRIMA_COLOR = 'hsl(var(--foreground))'

const MESES_CORTOS: Record<string, string> = {
  '01': 'Ene', '02': 'Feb', '03': 'Mar', '04': 'Abr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Ago',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dic',
}

const MESES_LARGOS: Record<string, string> = {
  '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
  '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
  '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre',
}

function etiquetaMes(mes: string) {
  return `${MESES_CORTOS[mes.slice(5, 7)] ?? mes} ${mes.slice(2, 4)}`
}

function TooltipProyeccion({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: { mes: string; prima_esperada: number } }[]
}) {
  if (!active || !payload?.[0]?.payload) return null
  const p = payload[0].payload
  return (
    <div className='rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md'>
      <p className='font-medium text-foreground'>
        {MESES_LARGOS[p.mes.slice(5, 7)] ?? p.mes} {p.mes.slice(0, 4)}
      </p>
      <p className='tabular-nums text-muted-foreground'>
        Prima esperada: {formatUF(p.prima_esperada)}
      </p>
    </div>
  )
}

function PuntoProyeccion(props: {
  cx?: number
  cy?: number
  payload?: { prima_esperada: number }
}) {
  const { cx, cy, payload } = props
  if (cx == null || cy == null || !payload || payload.prima_esperada <= 0) return null
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

type ExpectedPremiumProjectionChartClientProps = {
  className?: string
}

export default function ExpectedPremiumProjectionChartClient({ className }: ExpectedPremiumProjectionChartClientProps) {
  const { data, isLoading, isError } = useProyeccionPrimaEsperada()

  const serie = useMemo(() => {
    return (data ?? []).map((d) => ({
      ...d,
      monthLabel: etiquetaMes(d.mes),
    }))
  }, [data])

  const tieneAlgunDato = serie.some((p) => p.prima_esperada > 0)

  if (isLoading) return <MetricaCardSkeleton alto={220} className={className} />
  if (isError || !data) return <MetricaCardError className={className} />

  return (
    <Card className={cn('border-border bg-card shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md', className)}>
      <CardHeader className='pb-1.5 pt-2.5'>
        <CardTitle className='text-xs font-semibold text-foreground'>
          Proyecci&oacute;n de prima esperada por mes
        </CardTitle>
        <p className='text-xs text-muted-foreground'>
          Seg&uacute;n fecha estimada de cierre de las oportunidades abiertas
        </p>
      </CardHeader>
      <CardContent className='pb-2.5 pt-0'>
        {!tieneAlgunDato ? (
          <p className='py-10 text-center text-xs text-muted-foreground'>
            Sin oportunidades con fecha estimada de cierre.
          </p>
        ) : (
          <div className='h-[200px] w-full sm:h-[210px]'>
            <ResponsiveContainer width='100%' height={210}>
              <AreaChart data={serie} margin={{ top: 12, right: 12, left: 4, bottom: 4 }}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray='3 3'
                  className='stroke-border'
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
                <Tooltip content={<TooltipProyeccion />} cursor={{ stroke: 'hsl(var(--border))' }} />
                <Area
                  type='monotone'
                  dataKey='prima_esperada'
                  stroke={LINEA_PRIMA_COLOR}
                  strokeWidth={2.5}
                  fill='transparent'
                  dot={<PuntoProyeccion />}
                  activeDot={{ r: 5, fill: LINEA_PRIMA_COLOR, stroke: 'none' }}
                  connectNulls
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
