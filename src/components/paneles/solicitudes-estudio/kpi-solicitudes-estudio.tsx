'use client'

import { FileWarning, ClipboardList, ClipboardCheck, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/card'
import { cn } from '@/lib/utils'

export type TarjetaActiva = 'todas' | 'informacion_incompleta' | 'lista_para_cotizar' | 'con_cotizaciones'

type TarjetaConfig = {
  key: Exclude<TarjetaActiva, 'todas'>
  label: string
  icon: LucideIcon
}

const TARJETAS: TarjetaConfig[] = [
  { key: 'informacion_incompleta', label: 'Con información incompleta', icon: FileWarning },
  { key: 'lista_para_cotizar', label: 'Listas para cotizar', icon: ClipboardList },
  { key: 'con_cotizaciones', label: 'Cotizaciones emitidas', icon: ClipboardCheck },
]

type KpiSolicitudesEstudioProps = {
  conteos: Record<string, number>
  tarjetaActiva: TarjetaActiva
  onToggleTarjeta: (key: TarjetaActiva) => void
}

export default function KpiSolicitudesEstudio({
  conteos,
  tarjetaActiva,
  onToggleTarjeta,
}: KpiSolicitudesEstudioProps) {
  return (
    <div className='grid grid-cols-2 gap-2 lg:grid-cols-3'>
      {TARJETAS.map((t) => {
        const Icon = t.icon
        const value = conteos[t.key] ?? 0
        const activa = tarjetaActiva === t.key
        return (
          <Card
            key={t.key}
            role='button'
            tabIndex={0}
            onClick={() => onToggleTarjeta(tarjetaActiva === t.key ? 'todas' : t.key)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onToggleTarjeta(tarjetaActiva === t.key ? 'todas' : t.key)
              }
            }}
            className={cn(
              'cursor-pointer border-border bg-card shadow-none transition-colors hover:bg-muted/20',
              activa && 'border-primary/35 ring-1 ring-primary/15',
            )}
          >
            <CardContent className='flex items-center gap-2.5 px-3 py-2.5'>
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border/70 bg-muted/25',
                  activa && 'border-primary/30 bg-primary/[0.06]',
                )}
              >
                <Icon className='h-3.5 w-3.5 text-muted-foreground' aria-hidden />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='line-clamp-2 text-[10px] font-medium leading-snug text-muted-foreground'>
                  {t.label}
                </p>
                <p className='mt-0.5 text-lg font-semibold tabular-nums leading-none text-foreground'>
                  {value}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
