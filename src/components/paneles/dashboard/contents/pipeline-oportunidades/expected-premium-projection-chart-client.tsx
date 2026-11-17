'use client'

import { useMemo } from 'react'
import { CartesianGrid, Area, AreaChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/chart'
import { chartAxisTickUf, formatUF } from '@/lib/uf'
import { cn } from '@/lib/utils'
import {
  MetricaContenidoError,
  MetricaGraficoSkeleton,
} from '../../shared/metrica-card-skeleton'
import { useProyeccionPrimaEsperada } from '@/hooks/metricas/use-proyeccion-prima-esperada'

const chartConfig = {
  prima_esperada: {
    label: 'Prima esperada',
    color: 'var(--foreground)',
  },
} satisfies ChartConfig

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
      fill='var(--color-prima_esperada)'
      stroke='none'
    />
  )
}

type ExpectedPremiumProjectionChartClientProps = {
  className?: string
}

export default function ExpectedPremiumProjectionChartClient({ className }: ExpectedPremiumProjectionChartClientProps) {
  const { data, isLoading, isPlaceholderData, isError } = useProyeccionPrimaEsperada()

  const cargando = isLoading || isPlaceholderData

  const serie = useMemo(() => {
    return (data ?? []).map((d) => ({
      ...d,
      monthLabel: etiquetaMes(d.mes),
    }))
  }, [data])

  const tieneAlgunDato = serie.some((p) => p.prima_esperada > 0)

  return (
    <Card className={cn('border-border bg-card shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md', className)}>
      <CardHeader className='pb-1.5 pt-2.5'>
        <CardTitle className='text-xs font-semibold text-foreground'>
          Proyección de prima esperada por mes
        </CardTitle>
        <p className='text-xs text-muted-foreground'>
          Según fecha estimada de cierre de las oportunidades abiertas
        </p>
      </CardHeader>
      <CardContent className='pb-2.5 pt-0'>
        {cargando ? (
          <MetricaGraficoSkeleton alto={210} />
        ) : isError || !data ? (
          <MetricaContenidoError />
        ) : !tieneAlgunDato ? (
          <p className='py-10 text-center text-xs text-muted-foreground'>
            Sin oportunidades con fecha estimada de cierre.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='aspect-auto h-[200px] w-full sm:h-[210px]'
          >
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
              <ChartTooltip
                cursor={{ stroke: 'var(--border)' }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(_label, payload) => {
                      const mes = payload?.[0]?.payload?.mes as string | undefined
                      return mes
                        ? `${MESES_LARGOS[mes.slice(5, 7)] ?? mes} ${mes.slice(0, 4)}`
                        : ''
                    }}
                    formatter={(value) => formatUF(Number(value))}
                  />
                }
              />
              <Area
                type='monotone'
                dataKey='prima_esperada'
                stroke='var(--color-prima_esperada)'
                strokeWidth={2.5}
                fill='transparent'
                dot={<PuntoProyeccion />}
                activeDot={{ r: 5, fill: 'var(--color-prima_esperada)', stroke: 'none' }}
                connectNulls
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
