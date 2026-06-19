'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Skeleton } from '@/components/skeleton'
import { cn } from '@/lib/utils'

export type TarjetaActiva =
  | 'todas'
  | 'abiertos'
  | 'ganados'
  | 'perdidos'
  | 'verde'
  | 'amarillo'
  | 'rojo'

export type ConteosProcesos = Record<TarjetaActiva, number>

const KPI_LABELS: Record<TarjetaActiva, string> = {
  todas: 'Total procesos',
  abiertos: 'Abiertos',
  ganados: 'Ganados',
  perdidos: 'Perdidos',
  verde: 'En plazo',
  amarillo: 'En riesgo',
  rojo: 'Atrasados',
}

const TARJETAS: TarjetaActiva[] = [
  'todas',
  'abiertos',
  'ganados',
  'perdidos',
  'verde',
  'amarillo',
  'rojo',
]

const KPI_COLORS: Record<TarjetaActiva, string> = {
  todas: '',
  abiertos: '',
  ganados: 'border-emerald-400/40 bg-emerald-500/5',
  perdidos: 'border-red-400/40 bg-red-500/5',
  verde: 'border-emerald-400/40 bg-emerald-500/5',
  amarillo: 'border-amber-400/40 bg-amber-500/5',
  rojo: 'border-red-400/40 bg-red-500/5',
}

type KpiProcesosComercialesProps = {
  conteos: ConteosProcesos
  tarjetaActiva: TarjetaActiva
  onToggleTarjeta: (key: TarjetaActiva) => void
  loading?: boolean
}

export default function KpiProcesosComerciales({
  conteos,
  tarjetaActiva,
  onToggleTarjeta,
  loading,
}: KpiProcesosComercialesProps) {
  if (loading) {
    return (
      <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7'>
        {TARJETAS.map((key) => (
          <div
            key={key}
            className='rounded-lg border border-border bg-card px-3 py-3'
          >
            <Skeleton className='h-3 w-20' />
            <Skeleton className='mt-2 h-7 w-10' />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7'>
      {TARJETAS.map((key) => {
        const value = conteos[key] ?? 0
        const activa = tarjetaActiva === key
        return (
          <Card
            key={key}
            role='button'
            tabIndex={0}
            onClick={() => onToggleTarjeta(tarjetaActiva === key ? 'todas' : key)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onToggleTarjeta(tarjetaActiva === key ? 'todas' : key)
              }
            }}
            className={cn(
              'cursor-pointer border-border bg-card shadow-none transition-colors hover:bg-muted/50',
              activa && 'border-primary/35 ring-1 ring-primary/15',
              KPI_COLORS[key],
            )}
          >
            <CardHeader className='pb-1 pt-3'>
              <CardTitle className='text-xs font-medium leading-snug text-muted-foreground'>
                {KPI_LABELS[key]}
              </CardTitle>
            </CardHeader>
            <CardContent className='pb-3 pt-0'>
              <p className='text-2xl font-semibold tabular-nums text-foreground'>
                {value}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
