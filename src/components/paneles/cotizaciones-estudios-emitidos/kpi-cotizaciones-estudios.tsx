'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Skeleton } from '@/components/skeleton'
import { cn } from '@/lib/utils'

export type TarjetaActiva =
  | 'todas'
  | 'vigentes'
  | 'por_vencer'
  | 'vencidas'
  | 'estudios_pendientes'
  | 'estudios_finales_emitidos'

const KPI_LABELS: Record<string, string> = {
  vigentes: 'Cotizaciones vigentes',
  por_vencer: 'Por vencer',
  vencidas: 'Vencidas',
  estudios_pendientes: 'Estudios pendientes',
  estudios_finales_emitidos: 'Estudios finales emitidos',
}

const TARJETAS: TarjetaActiva[] = [
  'vigentes',
  'por_vencer',
  'vencidas',
  'estudios_pendientes',
  'estudios_finales_emitidos',
]

type KpiCotizacionesEstudiosProps = {
  conteos: Record<string, number>
  tarjetaActiva: TarjetaActiva
  onToggleTarjeta: (key: TarjetaActiva) => void
  loading?: boolean
}

export default function KpiCotizacionesEstudios({
  conteos,
  tarjetaActiva,
  onToggleTarjeta,
  loading,
}: KpiCotizacionesEstudiosProps) {
  if (loading) {
    return (
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
        {TARJETAS.map((key) => (
          <div
            key={key}
            className='rounded-lg border border-border bg-card px-3 py-3'
          >
            <Skeleton className='h-3 w-28' />
            <Skeleton className='mt-2 h-7 w-12' />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
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
