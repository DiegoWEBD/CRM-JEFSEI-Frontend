'use client'

import { useMemo, useState } from 'react'
import { PanelEstudioFila } from '@/aplicacion/cotizaciones-estudios/dto/panel-estudio-fila'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { ScrollArea } from '@/components/scroll-area'
import { Textarea } from '@/components/textarea'
import { Checkbox } from '@/components/checkbox'
import { Loader2 } from 'lucide-react'
import { useCotizaciones } from '@/hooks/cotizaciones/use-cotizaciones'
import { useArmarEstudioComercial } from '@/hooks/estudio-comercial/use-armar-estudio-comercial'
import { cn } from '@/lib/utils'

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const ESTADO_VENC_COLORS: Record<string, string> = {
  vigente:
    'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
  por_vencer:
    'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
  vencida: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20',
}

function calcularEstadoVenc(fechaStr: string): string {
  const hoy = new Date()
  const venc = new Date(fechaStr)
  const diffDias = (venc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
  if (diffDias < 0) return 'vencida'
  if (diffDias <= 30) return 'por_vencer'
  return 'vigente'
}

export type ConfiguracionEstudio = {
  infraseguro_primer_ejemplo: number
  infraseguro_segundo_ejemplo: number
  cantidad_cuotas: number
}

type DialogGenerarEstudioProps = {
  fila: PanelEstudioFila
  open: boolean
  onOpenChange: (open: boolean) => void
  configuracionEstudio?: ConfiguracionEstudio
}

export default function DialogGenerarEstudio({
  fila,
  open,
  onOpenChange,
  configuracionEstudio,
}: DialogGenerarEstudioProps) {
  const { data: cotizaciones } = useCotizaciones(fila.id)
  const armarMutation = useArmarEstudioComercial()

  const opciones = useMemo(() => cotizaciones ?? [], [cotizaciones])

  const [idsSeleccionados, setIdsSeleccionados] = useState<number[]>([])
  const [archivo, setArchivo] = useState<File | null>(null)
  const [observaciones, setObservaciones] = useState('')

  const [infraseguro1, setInfraseguro1] = useState(
    configuracionEstudio?.infraseguro_primer_ejemplo ?? 0.3,
  )
  const [infraseguro2, setInfraseguro2] = useState(
    configuracionEstudio?.infraseguro_segundo_ejemplo ?? 0.5,
  )
  const [cuotas, setCuotas] = useState(
    configuracionEstudio?.cantidad_cuotas ?? 6,
  )

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setIdsSeleccionados([])
      setArchivo(null)
      setObservaciones('')
      setInfraseguro1(configuracionEstudio?.infraseguro_primer_ejemplo ?? 0.3)
      setInfraseguro2(configuracionEstudio?.infraseguro_segundo_ejemplo ?? 0.5)
      setCuotas(configuracionEstudio?.cantidad_cuotas ?? 6)
    }
    onOpenChange(next)
  }

  const toggleId = (id: number) => {
    setIdsSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const handleGuardar = async () => {
    if (idsSeleccionados.length === 0) return

    const response = await armarMutation.mutateAsync({
      id_prospecto: fila.id_prospecto,
      infraseguro_primer_ejemplo: infraseguro1,
      infraseguro_segundo_ejemplo: infraseguro2,
      cantidad_cuotas: cuotas,
      ids_cotizacion: idsSeleccionados,
    })

    if (response.archivo_base64) {
      const byteChars = atob(response.archivo_base64)
      const byteNums = Array.from(byteChars, (c) => c.charCodeAt(0))
      const byteArray = new Uint8Array(byteNums)
      const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = response.nombre_archivo
      a.click()
      URL.revokeObjectURL(url)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='flex max-h-[92vh] max-w-lg flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl'>
        <DialogHeader className='shrink-0 border-b border-border px-4 py-3 pr-12'>
          <DialogTitle className='text-base'>Generar estudio</DialogTitle>
          <DialogDescription>
            Revise las cotizaciones recibidas y confirme la generación del
            estudio para el ejecutivo comercial.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='min-h-0 flex-1 overflow-y-auto'>
          <div className='space-y-4 px-4 py-3 text-sm'>
            <dl className='grid gap-2 rounded-md border border-border/80 bg-muted/20 p-3 text-xs sm:grid-cols-2'>
              <div>
                <dt className='text-muted-foreground'>Cliente</dt>
                <dd className='font-medium text-foreground'>
                  {fila.cliente}
                </dd>
              </div>
              <div>
                <dt className='text-muted-foreground'>Línea de seguro</dt>
                <dd className='font-medium text-foreground'>
                  {fila.linea_seguro}
                </dd>
              </div>
              <div className='sm:col-span-2'>
                <dt className='text-muted-foreground'>
                  Ejecutivo comercial
                </dt>
                <dd className='font-medium text-foreground'>
                  {fila.ejecutivo_comercial}
                </dd>
              </div>
            </dl>

            <div className='space-y-2'>
              <p className='text-xs font-medium text-foreground'>
                Cotizaciones recibidas
              </p>
              {opciones.length === 0 ? (
                <p className='rounded-md border border-dashed border-border px-3 py-4 text-xs text-muted-foreground'>
                  No hay cotizaciones registradas para esta solicitud.
                </p>
              ) : (
                <div className='space-y-2'>
                  {opciones.map((op) => {
                    const ev = calcularEstadoVenc(op.fecha_vencimiento)
                    const checked = idsSeleccionados.includes(op.id)
                    return (
                      <label
                        key={op.id}
                        htmlFor={`cot-chk-${op.id}`}
                        className={cn(
                          'flex cursor-pointer gap-3 rounded-md border bg-card px-3 py-2.5 transition-colors',
                          checked
                            ? 'border-primary/40 bg-primary/[0.04]'
                            : 'border-border/70',
                        )}
                      >
                        <Checkbox
                          id={`cot-chk-${op.id}`}
                          checked={checked}
                          onCheckedChange={() => toggleId(op.id)}
                          className='mt-0.5'
                        />
                        <div className='min-w-0 flex-1 space-y-1 text-xs'>
                          <p className='font-medium text-foreground'>
                            {op.company}
                          </p>
                          <p className='text-muted-foreground'>
                            Monto asegurado:{' '}
                            {op.monto_total_asegurado.toLocaleString('es-CL')} UF
                          </p>
                          <p className='text-muted-foreground'>
                            Recepción: {formatFecha(op.fecha_emision)} · Vence:{' '}
                            {formatFecha(op.fecha_vencimiento)}
                          </p>
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold leading-none',
                              ESTADO_VENC_COLORS[ev],
                            )}
                          >
                            {ev === 'vigente' && 'Vigente'}
                            {ev === 'por_vencer' && 'Por vencer'}
                            {ev === 'vencida' && 'Vencida'}
                          </span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              )}
              <p className='text-[10px] text-muted-foreground'>
                Seleccione una o más cotizaciones para incluir en el estudio.
              </p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='obs-estudio-gen' className='text-xs'>
                Observación del estudio (opcional)
              </Label>
              <Textarea
                id='obs-estudio-gen'
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder='Notas para el ejecutivo comercial…'
                className='min-h-[72px] text-xs'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='archivo-estudio-gen' className='text-xs'>
                Archivo del estudio generado (opcional)
              </Label>
              <Input
                id='archivo-estudio-gen'
                type='file'
                accept='.pdf,.doc,.docx,.xls,.xlsx,.zip,application/pdf'
                className='text-xs'
                onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
              />
              {archivo ? (
                <span className='truncate text-[11px] text-muted-foreground'>
                  {archivo.name}
                </span>
              ) : (
                <p className='text-[10px] text-muted-foreground'>
                  Si no adjunta PDF, el estudio quedará registrado como
                  generado en el sistema.
                </p>
              )}
            </div>

            {configuracionEstudio ? (
              <div className='space-y-3 rounded-md border border-border/80 bg-muted/20 p-3'>
                <p className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
                  Configuración del estudio
                </p>
                <div className='grid gap-3 sm:grid-cols-3'>
                  <div className='space-y-1.5'>
                    <Label className='text-xs'>Infraseguro ej. 1</Label>
                    <Input
                      type='number'
                      step='0.01'
                      min='0'
                      max='1'
                      className='h-8 text-xs'
                      value={infraseguro1}
                      onChange={(e) => setInfraseguro1(Number(e.target.value))}
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <Label className='text-xs'>Infraseguro ej. 2</Label>
                    <Input
                      type='number'
                      step='0.01'
                      min='0'
                      max='1'
                      className='h-8 text-xs'
                      value={infraseguro2}
                      onChange={(e) => setInfraseguro2(Number(e.target.value))}
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <Label className='text-xs'>Cant. cuotas</Label>
                    <Input
                      type='number'
                      min='1'
                      className='h-8 text-xs'
                      value={cuotas}
                      onChange={(e) => setCuotas(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </ScrollArea>

        <DialogFooter className='shrink-0 gap-2 border-t border-border px-4 py-3 sm:gap-0'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => onOpenChange(false)}
            disabled={armarMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type='button'
            size='sm'
            disabled={idsSeleccionados.length === 0 || armarMutation.isPending}
            onClick={() => void handleGuardar()}
          >
            {armarMutation.isPending ? (
              <>
                <Loader2 className='mr-1.5 size-3.5 animate-spin' aria-hidden />
                Guardando…
              </>
            ) : (
              'Guardar estudio'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
