'use client'

import { Badge } from '@/components/badge'
import Poliza from '@/dominio/poliza/poliza'
import { cn } from '@/lib/utils'
import {
  ESTADO_POLIZA_PERFIL_BADGE,
  ESTADO_POLIZA_PERFIL_LABELS,
} from '@/lib/estados-cotizaciones'
import { formatUfAmount } from '@/lib/uf'
import { formatearFecha } from '@/utils/formatear-fecha'
import { useState } from 'react'
import Link from 'next/link'
import { Eye } from 'lucide-react'

type ItemPolizaProps = {
  poliza: Poliza
}

export const filaPolizaGridClass =
  'grid min-w-[640px] grid-cols-[minmax(5.5rem,1.1fr)_minmax(5rem,1fr)_minmax(4.5rem,auto)_minmax(4.5rem,auto)_minmax(4rem,auto)_minmax(6.5rem,auto)] items-center gap-2 sm:gap-3'

export default function ItemPoliza({ poliza }: ItemPolizaProps) {
  const [verDetalle, setVerDetalle] = useState(false)

  const fechaFin = poliza.fin_vigencia
    ? formatearFecha(new Date(poliza.fin_vigencia), 'dd-MM-yyyy')
    : '—'

  return (
    <li className='space-y-1.5'>
      {/* Mobile */}
      <button
        type='button'
        onClick={() => setVerDetalle(!verDetalle)}
        className={cn(
          'flex w-full flex-col gap-1 rounded-md border border-border/60 bg-background px-2 py-1.5 text-left transition-colors sm:hidden',
          verDetalle && 'border-primary/25 bg-muted/20',
        )}
      >
        <div className='flex items-center justify-between gap-2'>
          <Link
            href={`/polizas/${poliza.numero_poliza}`}
            onClick={(e) => e.stopPropagation()}
            className='truncate text-[11px] font-medium text-primary underline-offset-2 hover:underline'
          >
            {poliza.numero_poliza}
          </Link>
          <Badge
            className={cn(
              ESTADO_POLIZA_PERFIL_BADGE[poliza.estado],
              'shrink-0 text-[10px]',
            )}
          >
            {ESTADO_POLIZA_PERFIL_LABELS[poliza.estado]}
          </Badge>
        </div>
        <div className='flex items-center justify-between gap-2'>
          <span className='truncate text-[10px] text-muted-foreground'>
            {poliza.company?.nombre ?? '—'}
          </span>
          <span className='shrink-0 text-[10px] tabular-nums text-muted-foreground'>
            {fechaFin}
          </span>
        </div>
        <span className='text-[10px] text-muted-foreground'>
          {formatUfAmount(poliza.prima_neta)}
        </span>
      </button>

      {/* Desktop */}
      <div
        className={cn(
          'hidden rounded-md border border-border/60 bg-background px-2 py-1.5 transition-colors sm:grid',
          filaPolizaGridClass,
          verDetalle && 'border-primary/25 bg-muted/20',
        )}
      >
        <Link
          href={`/polizas/${poliza.numero_poliza}`}
          className='truncate text-[11px] font-medium text-primary underline-offset-2 hover:underline'
          title={poliza.numero_poliza}
        >
          {poliza.numero_poliza}
        </Link>
        <span
          className='truncate text-[11px] text-muted-foreground'
          title={poliza.company?.nombre ?? undefined}
        >
          {poliza.company?.nombre ?? '—'}
        </span>
        <div className='min-w-0'>
          <Badge
            className={cn(
              ESTADO_POLIZA_PERFIL_BADGE[poliza.estado],
              'text-[10px] font-medium',
            )}
          >
            {ESTADO_POLIZA_PERFIL_LABELS[poliza.estado]}
          </Badge>
        </div>
        <span className='whitespace-nowrap text-[11px] tabular-nums text-muted-foreground'>
          {fechaFin}
        </span>
        <span
          className='truncate text-[11px] text-muted-foreground'
          title={formatUfAmount(poliza.prima_neta)}
        >
          {formatUfAmount(poliza.prima_neta)}
        </span>
        <div className='flex justify-end'>
          <button
            type='button'
            onClick={() => setVerDetalle(!verDetalle)}
            className='inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-[9px] font-medium text-muted-foreground hover:bg-muted/30 hover:text-foreground transition-colors'
          >
            <Eye className='h-3 w-3 shrink-0' aria-hidden />
            {verDetalle ? 'Ocultar' : 'Visualizar'}
          </button>
        </div>
      </div>

      {/* Detalle */}
      {verDetalle && (
        <div className='rounded border border-border/60 bg-muted/15 px-2 py-1.5 text-[11px] text-muted-foreground'>
          <p>
            <span className='font-medium text-foreground'>Vigencia:</span>{' '}
            {poliza.inicio_vigencia
              ? formatearFecha(
                  new Date(poliza.inicio_vigencia),
                  'dd-MM-yyyy',
                )
              : 'No indicado'}{' '}
            —{' '}
            {poliza.fin_vigencia
              ? formatearFecha(new Date(poliza.fin_vigencia), 'dd-MM-yyyy')
              : 'No indicado'}
          </p>
          <p className='mt-0.5'>
            <span className='font-medium text-foreground'>Emisión:</span>{' '}
            {formatearFecha(new Date(poliza.fecha_emision), 'dd-MM-yyyy')}
          </p>
          <p className='mt-0.5'>
            <span className='font-medium text-foreground'>Prima neta:</span>{' '}
            {formatUfAmount(poliza.prima_neta)}
          </p>
          <p className='mt-0.5'>
            <span className='font-medium text-foreground'>Tipo:</span>{' '}
            {poliza.tipo === 'nueva' ? 'Nueva' : 'Renovación'}
          </p>
        </div>
      )}
    </li>
  )
}
