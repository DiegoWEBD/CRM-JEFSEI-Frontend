'use client'

import { useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { colorDonut } from '@/lib/paleta-dashboard'
import { cn } from '@/lib/utils'

const SIN_DATOS = 'No hay datos disponibles para este per\u00edodo'

export default function PolicyDonutChart({
  title,
  data,
  className,
}: {
  title: string
  data: { nombre: string; cantidad: number }[]
  className?: string
}) {
  const [seleccionado, setSeleccionado] = useState<string | null>(null)

  const chartData = useMemo(() => {
    const conValor = data.filter((d) => d.cantidad > 0)
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
        {sinDatos ? (
          <p className='py-8 text-center text-xs text-muted-foreground'>{SIN_DATOS}</p>
        ) : (
          <div className='flex flex-col items-center -mt-1'>
            <div className='relative mx-auto w-full max-w-[280px]'>
              <div className='aspect-square w-full'>
                <ResponsiveContainer width='100%' height='100%'>
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
                          stroke={isSelected ? fill : 'hsl(var(--card))'}
                          strokeWidth={isSelected ? 3 : 1.5}
                          opacity={isDimmed ? 0.35 : 1}
                        />
                      )
                    })}
                  </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div
                className='pointer-events-none absolute inset-0 flex items-center justify-center'
                aria-hidden
              >
                <div className='rounded-full bg-card/95 px-4 py-2.5 text-center shadow-sm ring-1 ring-teal-500/15 backdrop-blur-[1px]'>
                  <p className='text-2xl font-bold tabular-nums leading-none tracking-tight sm:text-[1.75rem]'>
                    {total.toLocaleString('es-CL')}
                  </p>
                  <p className='mt-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/75'>
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
                      'inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] transition-all',
                      isSelected
                        ? 'font-semibold text-foreground shadow-sm'
                        : 'border-transparent bg-teal-500/[0.06] text-muted-foreground hover:bg-teal-500/10 hover:text-foreground',
                    )}
                    style={
                      isSelected
                        ? {
                            backgroundColor: `${fill}18`,
                            borderColor: `${fill}55`,
                            boxShadow: `0 1px 2px ${fill}22`,
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
