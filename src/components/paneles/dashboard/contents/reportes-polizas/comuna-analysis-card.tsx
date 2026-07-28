'use client'

import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { colorDonut, colorSegmento } from '@/lib/paleta-dashboard'
import { cn } from '@/lib/utils'

type ComunaAnalysisCardProps = {
  porComuna: { nombre: string; cantidad: number }[]
  porSexo: { nombre: string; cantidad: number }[]
  porRamo: { nombre: string; cantidad: number }[]
}

export default function ComunaAnalysisCard({
  porComuna,
  porSexo,
  porRamo,
}: ComunaAnalysisCardProps) {
  const [comuna, setComuna] = useState(() => porComuna[0]?.nombre ?? '')

  const opcionesComuna = useMemo(
    () => porComuna.filter((d) => d.cantidad > 0).map((d) => d.nombre),
    [porComuna],
  )

  const comunaActual = comuna || opcionesComuna[0] || ''

  const sexoData = useMemo(
    () =>
      porSexo
        .filter((d) => d.cantidad > 0)
        .map((d) => ({
          name: d.nombre,
          value: d.cantidad,
        })),
    [porSexo],
  )

  const ramoData = useMemo(
    () =>
      porRamo
        .filter((d) => d.cantidad > 0)
        .map((d, i) => ({
          name: d.nombre,
          linea: d.nombre,
          lineaCorta: d.nombre.length > 20 ? d.nombre.slice(0, 18) + '...' : d.nombre,
          cantidad: d.cantidad,
        })),
    [porRamo],
  )

  const totalComuna = useMemo(
    () => porComuna.find((d) => d.nombre === comunaActual)?.cantidad ?? 0,
    [porComuna, comunaActual],
  )

  const sinDatosSexo = sexoData.length === 0 || sexoData.every((d) => d.value === 0)
  const sinDatosRamo = ramoData.length === 0 || ramoData.every((d) => d.cantidad <= 0)
  const sinDatosGeneral = !comunaActual || totalComuna === 0

  return (
    <Card className='border-border bg-card shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'>
      <CardHeader className='flex flex-row items-center justify-between gap-2 space-y-0 pb-1.5 pt-2.5'>
        <CardTitle className='text-xs font-semibold text-foreground'>
          An&aacute;lisis de p&oacute;lizas por comuna y sexo
        </CardTitle>
        {opcionesComuna.length > 0 ? (
          <select
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
            className='h-7 rounded-md border border-border/80 bg-background px-2 text-xs shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
          >
            {opcionesComuna.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        ) : null}
      </CardHeader>
      <CardContent className='pb-2.5 pt-0'>
        <div className='grid gap-3 lg:grid-cols-[minmax(5.5rem,0.32fr)_minmax(10rem,0.68fr)_1fr]'>
          <div className='flex min-h-[10rem] flex-col items-center justify-center rounded-lg bg-muted/15 px-2 py-3'>
            <p className='text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80'>
              Total
            </p>
            {sinDatosGeneral ? (
              <p className='py-3 text-center text-xs text-muted-foreground'>
                No hay datos disponibles para este per&iacute;odo.
              </p>
            ) : (
              <>
                <p className='mt-1 text-[1.65rem] font-bold tabular-nums leading-none tracking-tight text-foreground'>
                  {totalComuna.toLocaleString('es-CL')}
                </p>
                <p className='mt-1.5 max-w-full truncate text-center text-[10px] font-medium text-teal-700 dark:text-teal-300'>
                  {comunaActual}
                </p>
              </>
            )}
          </div>

          <div className='flex min-h-[10rem] flex-col rounded-lg bg-muted/15 px-2 py-2.5'>
            <p className='mb-1.5 px-1 text-[10px] font-semibold text-muted-foreground'>
              P&oacute;lizas por sexo
            </p>
            {sinDatosSexo ? (
              <p className='flex flex-1 items-center justify-center py-3 text-center text-xs text-muted-foreground'>
                No hay datos disponibles para este per&iacute;odo.
              </p>
            ) : (
              <div className='relative mx-auto w-full max-w-[200px] flex-1'>
                <div className='aspect-square w-full'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                      data={sexoData}
                      dataKey='value'
                      nameKey='name'
                      cx='50%'
                      cy='50%'
                      innerRadius='52%'
                      outerRadius='78%'
                      paddingAngle={3}
                      cornerRadius={3}
                    >
                      {sexoData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={colorDonut(index)}
                          stroke='hsl(var(--card))'
                          strokeWidth={1.5}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className='mt-1 flex flex-wrap justify-center gap-1'>
                  {sexoData.map((entry, index) => (
                    <span
                      key={entry.name}
                      className='inline-flex items-center gap-1 rounded-full bg-teal-500/[0.06] px-1.5 py-0.5 text-[9px] text-muted-foreground'
                    >
                      <span
                        className='h-1.5 w-1.5 shrink-0 rounded-full'
                        style={{ backgroundColor: colorDonut(index) }}
                        aria-hidden
                      />
                      {entry.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className='flex min-h-[10rem] min-w-0 flex-col rounded-lg bg-muted/15 px-2 py-2.5 lg:min-h-[11rem]'>
            <p className='mb-1.5 px-1 text-[10px] font-semibold text-muted-foreground'>
              L&iacute;neas de seguro en {comunaActual || 'comuna'}
            </p>
            {sinDatosRamo ? (
              <p className='flex flex-1 items-center justify-center py-3 text-center text-xs text-muted-foreground'>
                No hay datos disponibles para este per&iacute;odo.
              </p>
            ) : (
              <div className='min-h-0 flex-1'>
                <div className='h-[180px] w-full sm:h-[200px] lg:h-[220px]'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                      data={ramoData}
                      margin={{ top: 6, right: 8, left: 2, bottom: 2 }}
                      barCategoryGap='22%'
                      barGap={2}
                  >
                    <CartesianGrid vertical={false} strokeDasharray='3 3' className='stroke-border/60' />
                    <XAxis
                      dataKey='lineaCorta'
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={9}
                      interval={0}
                      angle={-22}
                      textAnchor='end'
                      height={48}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={30}
                      fontSize={9}
                      allowDecimals={false}
                    />
                    <Bar dataKey='cantidad' radius={[5, 5, 0, 0]} maxBarSize={36}>
                      {ramoData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={colorSegmento(index)}
                          fillOpacity={0.9}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
