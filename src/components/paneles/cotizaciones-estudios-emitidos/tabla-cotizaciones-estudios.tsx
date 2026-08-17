'use client'

import { PanelEstudioFila } from '@/aplicacion/cotizaciones-estudios/dto/panel-estudio-fila'
import { Badge } from '@/components/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table'
import { Button } from '@/components/button'
import { Card, CardContent } from '@/components/card'
import Link from 'next/link'
import { ChevronRight, Eye, ExternalLink } from 'lucide-react'
import BadgeEstadoEstudio from './badge-estado-estudio'
import BadgePrioridad from '@/components/badge-prioridad/badge-prioridad'
import VencimientoCell from './vencimiento-cell'
import { SkeletonTabla } from './skeleton-tabla'
import { cn } from '@/lib/utils'
import { VENCIMIENTO_VARIANT } from '@/lib/badge-variants'

const headClass =
  'h-9 border-b border-border/50 bg-muted/40 px-3 py-2 text-left text-sm font-medium uppercase tracking-wide text-muted-foreground'

const cellClass = 'px-3 py-2.5 align-middle text-sm'

const ESTADO_VENCIMIENTO_LABELS: Record<string, string> = {
  vigente: 'Vigente',
  por_vencer: 'Por vencer',
  vencida: 'Vencida',
}

type TablaCotizacionesEstudiosProps = {
  filas: PanelEstudioFila[]
  isFetching: boolean
  onVerCotizaciones: (f: PanelEstudioFila) => void
}

export default function TablaCotizacionesEstudios({
  filas,
  isFetching,
  onVerCotizaciones,
}: TablaCotizacionesEstudiosProps) {
  if (isFetching && filas.length === 0) {
    return <SkeletonTabla />
  }

  if (filas.length === 0) {
    return (
      <div className='flex items-center justify-center py-12'>
        <p className='text-sm text-muted-foreground'>
          No hay registros que coincidan con los filtros.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className='space-y-3 lg:hidden'>
        {filas.map((f) => (
          <Card key={f.id} className='border-border bg-card shadow-none transition-colors hover:border-primary/40 hover:shadow-sm'>
            <CardContent className='p-4'>
              <div className='flex items-start justify-between gap-2'>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-semibold text-foreground'>
                    {f.cliente}
                  </p>
                  <p className='mt-0.5 truncate text-xs text-muted-foreground'>
                    {f.linea_seguro}
                  </p>
                </div>
                <ChevronRight className='mt-0.5 h-4 w-4 shrink-0 text-muted-foreground' />
              </div>

              <div className='mt-3 flex flex-wrap items-center gap-2'>
                <BadgeEstadoEstudio tieneEstudio={f.tiene_estudio} />
                <BadgePrioridad prioridad={f.prioridad} />
                {f.estado_vencimiento && (
                  <Badge
                    variant={VENCIMIENTO_VARIANT[f.estado_vencimiento]}
                    className='text-xs font-medium'
                  >
                    {ESTADO_VENCIMIENTO_LABELS[f.estado_vencimiento]}
                  </Badge>
                )}
              </div>

              <div className='mt-2 flex items-center justify-between text-sm text-muted-foreground'>
                <span>{f.ejecutivo_comercial}</span>
                {f.vencimiento_mas_proximo && (
                  <span className='tabular-nums'>
                    Vence:{' '}
                    {new Date(f.vencimiento_mas_proximo).toLocaleDateString(
                      'es-CL',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      },
                    )}
                  </span>
                )}
              </div>

              <div className='mt-3 flex flex-wrap gap-1.5'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='h-8 shrink-0 px-2.5 text-xs shadow-none'
                  onClick={() => onVerCotizaciones(f)}
                >
                  <Eye className='mr-1 h-3.5 w-3.5' />
                  Cotizaciones
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-8 shrink-0 px-2.5 text-xs shadow-none'
                  asChild
                >
                  <Link href={`/prospectos/${f.id_prospecto}`}>
                    <ExternalLink className='mr-1 h-3.5 w-3.5' />
                    Ver perfil
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='hidden overflow-x-auto lg:block'>
        <Table className='w-full table-fixed border-separate border-spacing-0'>
          <TableHeader>
            <TableRow className='border-0 hover:bg-transparent'>
              <TableHead className={cn(headClass, 'w-[18%]')}>
                Cliente
              </TableHead>
              <TableHead className={cn(headClass, 'w-[16%]')}>
                LÃ­nea de seguro
              </TableHead>
              <TableHead className={cn(headClass, 'w-[12%]')}>
                Ejecutivo comercial
              </TableHead>
              <TableHead className={cn(headClass, 'w-[20%]')}>
                Vencimiento mÃ¡s prÃ³ximo
              </TableHead>
              <TableHead className={cn(headClass, 'w-[10%]')}>
                Estado vencimiento
              </TableHead>
              <TableHead className={cn(headClass, 'w-[14%]')}>
                Estado de estudio
              </TableHead>
              <TableHead className={cn(headClass, 'w-[17%] text-right')}>
                AcciÃ³n
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filas.map((f) => (
              <TableRow
                key={f.id}
                className='border-0 border-b border-border/60 transition-colors last:border-b-0 hover:bg-accent/40'
              >
                <TableCell className={cn(cellClass, 'font-medium text-foreground')}>
                  <span className='line-clamp-2 text-xs leading-snug'>
                    {f.cliente}
                  </span>
                </TableCell>
                <TableCell className={cn(cellClass, 'text-muted-foreground')}>
                  <span className='line-clamp-2 text-sm leading-snug'>
                    {f.linea_seguro}
                  </span>
                </TableCell>
                <TableCell className={cn(cellClass, 'text-sm text-muted-foreground')}>
                  <span className='line-clamp-2 leading-snug'>
                    {f.ejecutivo_comercial}
                  </span>
                </TableCell>
                <TableCell className={cn(cellClass, 'p-1.5')}>
                  <VencimientoCell
                    idSolicitud={f.id}
                    cantidadCotizaciones={f.cantidad_cotizaciones}
                    vencimientoMasProximo={f.vencimiento_mas_proximo}
                    estadoVencimiento={f.estado_vencimiento}
                  />
                </TableCell>
                <TableCell className={cn(cellClass, 'p-1.5')}>
                  {f.estado_vencimiento ? (
                    <Badge
                      variant={VENCIMIENTO_VARIANT[f.estado_vencimiento]}
                      className='text-xs font-medium'
                    >
                      {ESTADO_VENCIMIENTO_LABELS[f.estado_vencimiento]}
                    </Badge>
                  ) : (
                    <span className='text-xs text-muted-foreground'>â€”</span>
                  )}
                </TableCell>
                <TableCell className={cn(cellClass, 'p-1.5')}>
                  <BadgeEstadoEstudio tieneEstudio={f.tiene_estudio} />
                </TableCell>
                <TableCell className={cn(cellClass, 'p-1.5 text-right')}>
                  <div className='flex flex-col items-end gap-1 sm:flex-row sm:flex-wrap sm:justify-end'>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      className='h-7 w-full px-2 text-sm shadow-none sm:w-auto'
                      onClick={() => onVerCotizaciones(f)}
                    >
                      Ver cotizaciones
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-7 w-full px-2 text-sm shadow-none sm:w-auto'
                      asChild
                    >
                      <Link href={`/prospectos/${f.id_prospecto}`}>
                        <ExternalLink className='mr-1 size-3' aria-hidden />
                        Ver perfil
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
