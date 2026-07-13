'use client'

import { FileWarning, ClipboardList, ClipboardCheck, FileCheck, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/card'
import { cn } from '@/lib/utils'

export type TarjetaActiva = 'todas' | 'informacion_incompleta' | 'lista_para_cotizar' | 'con_cotizaciones' | 'estudio_emitido'

type TarjetaConfig = {
  key: Exclude<TarjetaActiva, 'todas'>
  label: string
  icon: LucideIcon
}

const TARJETAS: TarjetaConfig[] = [
  { key: 'informacion_incompleta', label: 'Con información incompleta', icon: FileWarning },
  { key: 'lista_para_cotizar', label: 'Listas para cotizar', icon: ClipboardList },
  { key: 'con_cotizaciones', label: 'Cotizaciones emitidas', icon: ClipboardCheck },
  { key: 'estudio_emitido', label: 'Estudios emitidos', icon: FileCheck },
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
    <div className='grid grid-cols-2 gap-2 lg:grid-cols-4'>
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
              'cursor-pointer border-border bg-card transition-all duration-150 hover:bg-muted/20 hover:-translate-y-0.5 hover:shadow-md',
              activa && 'border-primary/35 ring-1 ring-primary/15',
            )}
          >
            <CardContent className='flex items-center gap-3 px-3 py-3'>
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                  activa
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted/50 text-muted-foreground',
                )}
              >
                <Icon className='h-5 w-5' aria-hidden />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='line-clamp-2 text-[11px] font-semibold leading-snug text-foreground/70'>
                  {t.label}
                </p>
                <p className='mt-0.5 text-xl font-bold tabular-nums leading-none text-foreground'>
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
