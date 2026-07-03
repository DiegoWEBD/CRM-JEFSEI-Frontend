'use client'

import { PanelEstudioFila } from '@/aplicacion/cotizaciones-estudios/dto/panel-estudio-fila'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog'
import { Button } from '@/components/button'
import { ScrollArea } from '@/components/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table'
import { Skeleton } from '@/components/skeleton'
import { useCotizaciones } from '@/hooks/cotizaciones/use-cotizaciones'
import { cn } from '@/lib/utils'
import { Download } from 'lucide-react'

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatNum(n: number) {
  return n.toLocaleString('es-CL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function FilaResumen({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <dt className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
        {label}
      </dt>
      <dd className='mt-0.5 text-sm text-foreground'>{children}</dd>
    </div>
  )
}

const ESTADO_COLORS: Record<string, string> = {
  vigente:
    'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
  por_vencer:
    'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
  vencida: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
}

function calcularEstado(fechaStr: string): string {
  const hoy = new Date()
  const venc = new Date(fechaStr)
  const diffDias = (venc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
  if (diffDias < 0) return 'vencida'
  if (diffDias <= 30) return 'por_vencer'
  return 'vigente'
}

const ESTADO_LABEL: Record<string, string> = {
  vigente: 'Vigente',
  por_vencer: 'Por vencer',
  vencida: 'Vencida',
}

function descargarPDF(base64: string, nombreArchivo: string) {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombreArchivo
  a.click()
  URL.revokeObjectURL(url)
}

type DialogVerCotizacionesProps = {
  fila: PanelEstudioFila
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DialogVerCotizaciones({
  fila,
  open,
  onOpenChange,
}: DialogVerCotizacionesProps) {
  const { data: cotizaciones, isLoading } = useCotizaciones(fila.id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[90vh] w-[95vw] max-w-lg flex-col gap-0 p-0 lg:max-w-6xl'>
        <DialogHeader className='border-b border-border px-3 py-3 pr-10 sm:px-4 sm:pr-12'>
          <DialogTitle className='text-left text-sm leading-snug sm:text-base'>
            Cotizaciones recibidas
          </DialogTitle>
          <p className='text-left text-[11px] text-muted-foreground sm:text-xs'>
            Opciones de compañías aseguradoras para armar el estudio final.
          </p>
        </DialogHeader>

        <div className='border-b border-border/80 px-3 py-3 sm:px-4'>
          <dl className='grid grid-cols-2 gap-2 text-xs sm:gap-3 sm:text-sm'>
            <FilaResumen label='Cliente'>{fila.cliente}</FilaResumen>
            <FilaResumen label='Línea de seguro'>
              {fila.linea_seguro}
            </FilaResumen>
            <FilaResumen label='Ejecutivo comercial'>
              {fila.ejecutivo_comercial}
            </FilaResumen>
            <FilaResumen label='Opciones cotizadas'>
              {fila.cantidad_cotizaciones}
            </FilaResumen>
          </dl>
        </div>

        {isLoading ? (
          <div className='space-y-2 px-3 py-4 sm:px-4'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='flex gap-4'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-4 w-28' />
              </div>
            ))}
          </div>
        ) : cotizaciones && cotizaciones.length > 0 ? (
          <>
            {/* Mobile: cards */}
            <div className='space-y-2 overflow-y-auto px-3 py-3 lg:hidden'>
              {cotizaciones.map((c) => {
                const ev = calcularEstado(c.fecha_vencimiento)
                return (
                  <div
                    key={c.id}
                    className='rounded-lg border border-border/70 bg-card p-3 text-xs'
                  >
                    <div className='mb-2 flex items-start justify-between gap-2'>
                      <span className='text-sm font-medium text-foreground'>
                        {c.company}
                      </span>
                      <span
                        className={cn(
                          'mt-0.5 inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[9px] font-semibold leading-none',
                          ESTADO_COLORS[ev],
                        )}
                      >
                        {ESTADO_LABEL[ev]}
                      </span>
                    </div>
                    <div className='grid grid-cols-2 gap-x-3 gap-y-1.5 text-muted-foreground'>
                      <div>
                        <span className='text-[9px] uppercase tracking-wide'>
                          Monto asegurado
                        </span>
                        <p className='tabular-nums text-foreground/90'>
                          {formatNum(c.monto_total_asegurado)} UF
                        </p>
                      </div>
                      {c.nombre_archivo && c.archivo_base64 && (
                        <div className='col-span-2 mt-1'>
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            className='h-7 w-full text-[10px]'
                            onClick={() =>
                              descargarPDF(
                                c.archivo_base64!,
                                c.nombre_archivo!,
                              )
                            }
                          >
                            <Download className='mr-1 h-3 w-3' />
                            Descargar PDF
                          </Button>
                        </div>
                      )}
                      <div>
                            <span className='text-[9px] uppercase tracking-wide'>
                          Tasa afecta
                        </span>
                        <p className='tabular-nums text-foreground/90'>
                          {formatNum(c.tasa_afecta)}
                        </p>
                      </div>
                      <div>
                        <span className='text-[9px] uppercase tracking-wide'>
                          Tasa excenta
                        </span>
                        <p className='tabular-nums text-foreground/90'>
                          {formatNum(c.tasa_excenta)}
                        </p>
                      </div>
                      <div>
                        <span className='text-[9px] uppercase tracking-wide'>
                          Tasa política
                        </span>
                        <p className='tabular-nums text-foreground/90'>
                          {formatNum(c.tasa_politica)}
                        </p>
                      </div>
                      <div>
                        <span className='text-[9px] uppercase tracking-wide'>
                          Prima adicional
                        </span>
                        <p className='tabular-nums text-foreground/90'>
                          {formatNum(c.prima_adicional_asistencia)} UF
                        </p>
                      </div>
                      <div>
                        <span className='text-[9px] uppercase tracking-wide'>
                          Emisión
                        </span>
                        <p className='text-foreground/90'>
                          {formatFecha(c.fecha_emision)}
                        </p>
                      </div>
                      <div>
                        <span className='text-[9px] uppercase tracking-wide'>
                          Vencimiento
                        </span>
                        <p className='text-foreground/90'>
                          {formatFecha(c.fecha_vencimiento)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Desktop: table */}
            <ScrollArea className='hidden max-h-[min(55vh,420px)] overflow-x-auto lg:block'>
              <Table className='w-full'>
                <TableHeader>
                  <TableRow className='border-border/50 hover:bg-muted/25'>
                    <TableHead className='whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
                      Compañía
                    </TableHead>
                    <TableHead className='whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
                      Monto asegurado
                    </TableHead>
                    <TableHead className='whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
                      Tasa afecta
                    </TableHead>
                    <TableHead className='whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
                      Tasa excenta
                    </TableHead>
                    <TableHead className='whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
                      Tasa política
                    </TableHead>
                    <TableHead className='whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
                      Prima adicional
                    </TableHead>
                    <TableHead className='whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
                      Emisión
                    </TableHead>
                    <TableHead className='whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
                      Vencimiento
                    </TableHead>
                    <TableHead className='text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
                      Estado venc.
                    </TableHead>
                    <TableHead className='w-10'></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cotizaciones.map((c) => {
                    const ev = calcularEstado(c.fecha_vencimiento)
                    return (
                      <TableRow
                        key={c.id}
                        className='border-border/40 hover:bg-muted/20'
                      >
                        <TableCell className='max-w-[140px] whitespace-nowrap text-sm text-foreground'>
                          {c.company}
                        </TableCell>
                        <TableCell className='whitespace-nowrap text-xs tabular-nums text-muted-foreground'>
                          {formatNum(c.monto_total_asegurado)} UF
                        </TableCell>
                        <TableCell className='whitespace-nowrap text-xs tabular-nums text-muted-foreground'>
                          {formatNum(c.tasa_afecta)}
                        </TableCell>
                        <TableCell className='whitespace-nowrap text-xs tabular-nums text-muted-foreground'>
                          {formatNum(c.tasa_excenta)}
                        </TableCell>
                        <TableCell className='whitespace-nowrap text-xs tabular-nums text-muted-foreground'>
                          {formatNum(c.tasa_politica)}
                        </TableCell>
                        <TableCell className='whitespace-nowrap text-xs tabular-nums text-muted-foreground'>
                          {formatNum(c.prima_adicional_asistencia)} UF
                        </TableCell>
                        <TableCell className='whitespace-nowrap text-xs text-muted-foreground'>
                          {formatFecha(c.fecha_emision)}
                        </TableCell>
                        <TableCell className='whitespace-nowrap text-xs text-muted-foreground'>
                          {formatFecha(c.fecha_vencimiento)}
                        </TableCell>
                        <TableCell className='py-2'>
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none',
                              ESTADO_COLORS[ev],
                            )}
                          >
                            {ESTADO_LABEL[ev]}
                          </span>
                        </TableCell>
                        <TableCell className='py-2'>
                          {c.nombre_archivo && c.archivo_base64 && (
                            <button
                              type='button'
                              className='text-muted-foreground hover:text-foreground'
                              title='Descargar PDF'
                              onClick={() =>
                                descargarPDF(
                                  c.archivo_base64!,
                                  c.nombre_archivo!,
                                )
                              }
                            >
                              <Download className='h-3.5 w-3.5' />
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </>
        ) : (
          <p className='px-4 py-6 text-center text-sm text-muted-foreground'>
            No hay cotizaciones registradas para esta solicitud.
          </p>
        )}

        <DialogFooter className='border-t border-border px-3 py-3 sm:px-4'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
