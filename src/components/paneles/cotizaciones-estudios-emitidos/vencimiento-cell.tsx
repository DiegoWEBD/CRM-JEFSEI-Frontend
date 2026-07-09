'use client'

import { useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/button'
import { Badge } from '@/components/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/popover'
import { Skeleton } from '@/components/skeleton'
import { useCotizaciones } from '@/hooks/cotizaciones/use-cotizaciones'
import { cn } from '@/lib/utils'

function calendarioDiffDias(desde: Date, hasta: Date) {
  const u1 = Date.UTC(desde.getFullYear(), desde.getMonth(), desde.getDate())
  const u2 = Date.UTC(hasta.getFullYear(), hasta.getMonth(), hasta.getDate())
  return Math.round((u2 - u1) / 86400000)
}

function textoPlazoVencimientoRelativo(
  fechaVencIso: string,
  ahora: Date,
): string {
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
  const v = new Date(fechaVencIso)
  const vd = new Date(v.getFullYear(), v.getMonth(), v.getDate())
  const dias = calendarioDiffDias(hoy, vd)
  if (dias < 0) {
    const a = Math.abs(dias)
    return `vencida hace ${a} ${a === 1 ? 'día' : 'días'}`
  }
  if (dias === 0) return 'vence hoy'
  return `vence en ${dias} ${dias === 1 ? 'día' : 'días'}`
}

function formatFechaCelda(iso: string) {
  return new Date(iso).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const ESTADO_VENCIMIENTO_COLORS: Record<string, string> = {
  vigente:
    'border-emerald-500/45 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100',
  por_vencer:
    'border-amber-500/45 bg-amber-500/10 text-amber-950 dark:text-amber-100',
  vencida:
    'border-red-500/40 bg-red-500/10 text-red-900 dark:text-red-100',
}

type VencimientoCellProps = {
  idSolicitud: number
  cantidadCotizaciones: number
  vencimientoMasProximo: string | null
  estadoVencimiento: string | null
}

export default function VencimientoCell({
  idSolicitud,
  cantidadCotizaciones,
  vencimientoMasProximo,
  estadoVencimiento,
}: VencimientoCellProps) {
  const { data: cotizaciones, isLoading } = useCotizaciones(idSolicitud)
  const ahora = useMemo(() => new Date(), [])

  const opciones = useMemo(() => {
    if (!cotizaciones) return []
    return [...cotizaciones].sort(
      (a, b) =>
        new Date(a.fecha_vencimiento).getTime() -
        new Date(b.fecha_vencimiento).getTime(),
    )
  }, [cotizaciones])

  if (isLoading) {
    return (
      <Skeleton className='h-10 max-w-[200px] rounded-md' />
    )
  }

  if (!vencimientoMasProximo || opciones.length === 0) {
    return (
      <span className='text-[11px] text-muted-foreground'>—</span>
    )
  }

  const principal = opciones[0]
  const varias = opciones.length > 1
  const lineaPlazo = textoPlazoVencimientoRelativo(
    principal.fecha_vencimiento,
    ahora,
  )

  const resumen = (
    <div className='flex min-w-0 flex-1 items-start gap-1'>
      <div className='min-w-0 flex-1 space-y-0.5'>
        <p className='line-clamp-2 text-[11px] leading-snug text-foreground'>
          <span className='font-medium'>{principal.company}</span>
          <span className='text-muted-foreground'> · {lineaPlazo}</span>
        </p>
        <p className='tabular-nums text-[11px] text-muted-foreground'>
          {formatFechaCelda(principal.fecha_vencimiento)}
        </p>
        <p className='text-[10px] text-muted-foreground/90'>
          {opciones.length}{' '}
          {opciones.length === 1 ? 'opción cotizada' : 'opciones cotizadas'}
        </p>
      </div>
      {varias ? (
        <ChevronDown
          className='mt-0.5 size-3.5 shrink-0 text-muted-foreground opacity-70'
          aria-hidden
        />
      ) : (
        <ChevronDown
          className='mt-0.5 size-3 shrink-0 text-muted-foreground opacity-35'
          aria-hidden
        />
      )}
    </div>
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          className={cn(
            'h-auto min-h-[2.25rem] w-full justify-start gap-0 whitespace-normal rounded-md px-1.5 py-1 text-left font-normal hover:bg-muted/60',
          )}
        >
          {resumen}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        sideOffset={6}
        className='w-80 max-w-[min(92vw,20rem)] p-0 shadow-md'
      >
        <div className='max-h-[min(46vh,280px)] overflow-y-auto p-2'>
          <p className='px-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
            {varias ? 'Opciones cotizadas' : 'Cotización'}
          </p>
          <ul className='space-y-1.5'>
            {opciones.map((op) => {
              const plazo = textoPlazoVencimientoRelativo(
                op.fecha_vencimiento,
                ahora,
              )
              return (
                <li
                  key={op.id}
                  className='rounded-md border border-border/50 bg-card px-2 py-1.5'
                >
                  <div className='flex flex-wrap items-start justify-between gap-x-2 gap-y-1'>
                    <p className='min-w-0 flex-1 text-[11px] leading-snug text-foreground'>
                      <span className='font-medium'>{op.company}</span>
                      <span className='text-muted-foreground'> · {plazo}</span>
                    </p>
                    <div className='shrink-0'>
                      {estadoVencimiento && (
                        <Badge
                          variant='outline'
                          className={cn(
                            'text-[10px] font-medium',
                            ESTADO_VENCIMIENTO_COLORS[estadoVencimiento],
                          )}
                        >
                          {estadoVencimiento === 'vigente' && 'Vigente'}
                          {estadoVencimiento === 'por_vencer' && 'Por vencer'}
                          {estadoVencimiento === 'vencida' && 'Vencida'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className='mt-0.5 tabular-nums text-[11px] text-muted-foreground'>
                    {formatFechaCelda(op.fecha_vencimiento)}
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  )
}
