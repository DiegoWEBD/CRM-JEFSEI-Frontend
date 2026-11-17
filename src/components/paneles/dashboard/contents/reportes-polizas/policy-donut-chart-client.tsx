'use client'

import { useMemo, useState } from 'react'
import { Cell, Pie, PieChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/chart'
import { colorDonut } from '@/lib/paleta-dashboard'
import { cn } from '@/lib/utils'
import { useFiltrosDashboard } from '../../filtros-dashboard-context'
import {
  MetricaContenidoError,
  MetricaGraficoSkeleton,
} from '../../shared/metrica-card-skeleton'
import { usePolizasPorComuna } from '@/hooks/metricas/use-polizas-por-comuna'
import { usePolizasPorRamo } from '@/hooks/metricas/use-polizas-por-ramo'
import { usePolizasPorRangoEdad } from '@/hooks/metricas/use-polizas-por-rango-edad'
import { usePolizasPorSexo } from '@/hooks/metricas/use-polizas-por-sexo'
import type { ItemCantidad } from '@/aplicacion/metricas/dto/metricas-dashboard-json'

const SIN_DATOS = 'No hay datos disponibles para este período'

const chartConfig = {} satisfies ChartConfig

export type MetricaDonutPolizas = 'comuna' | 'sexo' | 'rango-edad' | 'ramo'

const HOOKS_DONUT: Record<
  MetricaDonutPolizas,
  (mes?: number, year?: number) => { data: ItemCantidad[] | undefined; isLoading: boolean; isPlaceholderData: boolean; isError: boolean }
> = {
  comuna: usePolizasPorComuna,
  sexo: usePolizasPorSexo,
  'rango-edad': usePolizasPorRangoEdad,
  ramo: usePolizasPorRamo,
}

export default function PolicyDonutChartClient({
  title,
  metrica,
  className,
}: {
  title: string
  metrica: MetricaDonutPolizas
  className?: string
}) {
  const { mes, year } = useFiltrosDashboard()
  const [seleccionado, setSeleccionado] = useState<string | null>(null)

  const useMetrica = HOOKS_DONUT[metrica]
  const { data, isLoading, isPlaceholderData, isError } = useMetrica(mes, year)

  const cargando = isLoading || isPlaceholderData

  const chartData = useMemo(() => {
    const conValor = (data ?? []).filter((d) => d.cantidad > 0)
    const total = conValor.reduce((s, d) => s + d.cantidad, 0)
    return conValor.map((d) => ({
      name: d.nombre,
      value: d.cantidad,
      porcentaje: total > 0 ? Math.round((d.cantidad / total) * 100) : 0,
    }))
  }, [data])

  const total = useMemo(() => chartData.reduce((s, d) => s + d.value, 0), [chartData])

  const sinDatos = chartData.length === 0

  return (
    <Card className={cn('border-border bg-card shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md', className)}>
      <CardHeader className='space-y-0 pb-1 pt-2.5'>
        <CardTitle className='text-xs font-semibold text-foreground'>{title}</CardTitle>
      </CardHeader>
      <CardContent className='pb-2.5 pt-0'>
        {cargando ? (
          <MetricaGraficoSkeleton alto={260} />
        ) : isError ? (
          <MetricaContenidoError />
        ) : sinDatos ? (
          <p className='py-8 text-center text-xs text-muted-foreground'>{SIN_DATOS}</p>
        ) : (
          <div className='flex flex-col items-center -mt-1'>
            <div className='relative mx-auto w-full max-w-[280px]'>
              <ChartContainer config={chartConfig} className='aspect-square w-full'>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    innerRadius='58%'
                    outerRadius='82%'
                    paddingAngle={3}
                    cornerRadius={4}
                    className='cursor-pointer'
                    onClick={(_e, index) => {
                      const entry = chartData[index]
                      if (entry?.name) {
                        setSeleccionado((prev) => (prev === entry.name ? null : entry.name))
                      }
                    }}
                  >
                    {chartData.map((entry, index) => {
                      const fill = colorDonut(index)
                      const isSelected = seleccionado === entry.name
                      const isDimmed = seleccionado && seleccionado !== entry.name
                      return (
                        <Cell
                          key={entry.name}
                          fill={fill}
                          stroke={isSelected ? fill : 'var(--card)'}
                          strokeWidth={isSelected ? 3 : 1.5}
                          opacity={isDimmed ? 0.35 : 1}
                        />
                      )
                    })}
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, _name, item) =>
                          `${Number(value).toLocaleString('es-CL')} (${
                            (item.payload?.porcentaje as number | undefined) ?? 0
                          }%)`
                        }
                      />
                    }
                  />
                </PieChart>
              </ChartContainer>
              <div
                className='pointer-events-none absolute inset-0 flex items-center justify-center'
                aria-hidden
              >
                <div className='rounded-full bg-card/95 px-4 py-2.5 text-center shadow-sm ring-1 ring-primary/15 backdrop-blur-[1px]'>
                  <p className='text-2xl font-bold tabular-nums leading-none tracking-tight sm:text-[1.75rem]'>
                    {total.toLocaleString('es-CL')}
                  </p>
                  <p className='mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground/75'>
                    Total
                  </p>
                </div>
              </div>
            </div>
            <div className='mt-0.5 flex flex-wrap justify-center gap-1.5 px-1 pb-0.5'>
              {chartData.map((entry, index) => {
                const fill = colorDonut(index)
                const isSelected = seleccionado === entry.name
                return (
                  <button
                    key={entry.name}
                    type='button'
                    onClick={() =>
                      setSeleccionado((prev) => (prev === entry.name ? null : entry.name))
                    }
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs transition-all',
                      isSelected
                        ? 'text-white shadow-sm'
                        : 'border-transparent bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground',
                    )}
                    style={
                      isSelected
                        ? {
                            backgroundColor: fill,
                            borderColor: fill,
                          }
                        : undefined
                    }
                    aria-pressed={isSelected}
                  >
                    <span
                      className='h-2 w-2 shrink-0 rounded-full ring-1 ring-white/80'
                      style={{ backgroundColor: fill }}
                      aria-hidden
                    />
                    {entry.name} ({entry.porcentaje}%)
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
