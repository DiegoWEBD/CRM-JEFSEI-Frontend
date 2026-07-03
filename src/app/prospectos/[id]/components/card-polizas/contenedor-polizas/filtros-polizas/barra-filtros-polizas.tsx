'use client'

import { Label } from '@/components/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { Search } from 'lucide-react'
import type { EstadoPoliza } from '@/lib/estados-cotizaciones'
import { ESTADO_POLIZA_PERFIL_LABELS } from '@/lib/estados-cotizaciones'

export type FiltrosPolizaEstado = EstadoPoliza | 'todas'
export type FiltrosRangoVencimiento = 'todas' | '30' | '60' | '90' | 'vencidas'

export type FiltrosPolizasCliente = {
  estado: FiltrosPolizaEstado
  compania: string
  rangoVencimiento: FiltrosRangoVencimiento
  busqueda: string
}

export const FILTROS_POLIZAS_INICIAL: FiltrosPolizasCliente = {
  estado: 'todas',
  compania: 'todas',
  rangoVencimiento: 'todas',
  busqueda: '',
}

type BarraFiltrosPolizasProps = {
  filtros: FiltrosPolizasCliente
  companias: string[]
  hayFiltrosActivos: boolean
  onCambiar: <K extends keyof FiltrosPolizasCliente>(
    key: K,
    value: FiltrosPolizasCliente[K],
  ) => void
  onLimpiar: () => void
}

const OPCIONES_ESTADO: { value: FiltrosPolizaEstado; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  ...Object.entries(ESTADO_POLIZA_PERFIL_LABELS).map(([value, label]) => ({
    value: value as EstadoPoliza,
    label,
  })),
]

const OPCIONES_RANGO_VENCIMIENTO: {
  value: FiltrosRangoVencimiento
  label: string
}[] = [
  { value: 'todas', label: 'Todas' },
  { value: '30', label: 'Vencen en 30 días' },
  { value: '60', label: 'Vencen en 60 días' },
  { value: '90', label: 'Vencen en 90 días' },
  { value: 'vencidas', label: 'Vencidas' },
]

const selectClass = 'h-8 w-full text-xs shadow-none'

export default function BarraFiltrosPolizas({
  filtros,
  companias,
  hayFiltrosActivos,
  onCambiar,
  onLimpiar,
}: BarraFiltrosPolizasProps) {
  return (
    <div className='rounded-lg border border-border/80 bg-muted/10 p-2.5'>
      <div className='flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end'>
        <div className='w-full sm:w-auto sm:min-w-[8.5rem] sm:max-w-[9.5rem]'>
          <Label className='mb-1 block text-[10px] text-muted-foreground'>
            Estado
          </Label>
          <Select
            value={filtros.estado}
            onValueChange={(v) =>
              onCambiar('estado', v as FiltrosPolizaEstado)
            }
          >
            <SelectTrigger className={selectClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OPCIONES_ESTADO.map((o) => (
                <SelectItem key={o.value} value={o.value} className='text-xs'>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='w-full sm:w-auto sm:min-w-[8.5rem] sm:max-w-[10rem]'>
          <Label className='mb-1 block text-[10px] text-muted-foreground'>
            Compañía
          </Label>
          <Select
            value={filtros.compania}
            onValueChange={(v) => onCambiar('compania', v)}
          >
            <SelectTrigger className={selectClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='todas' className='text-xs'>
                Todas
              </SelectItem>
              {companias.map((c) => (
                <SelectItem key={c} value={c} className='text-xs'>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='w-full sm:w-auto sm:min-w-[8.5rem] sm:max-w-[11rem]'>
          <Label className='mb-1 block text-[10px] text-muted-foreground'>
            Vencimiento
          </Label>
          <Select
            value={filtros.rangoVencimiento}
            onValueChange={(v) =>
              onCambiar(
                'rangoVencimiento',
                v as FiltrosRangoVencimiento,
              )
            }
          >
            <SelectTrigger className={selectClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OPCIONES_RANGO_VENCIMIENTO.map((o) => (
                <SelectItem key={o.value} value={o.value} className='text-xs'>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='w-full sm:min-w-[10rem] sm:flex-[1.4] sm:max-w-[14rem]'>
          <Label className='mb-1 block text-[10px] text-muted-foreground'>
            Buscar
          </Label>
          <div className='relative'>
            <Search className='pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground' />
            <Input
              className='h-8 pl-7 text-xs shadow-none'
              placeholder='Nº, compañía o producto...'
              value={filtros.busqueda}
              onChange={(e) => onCambiar('busqueda', e.target.value)}
            />
          </div>
        </div>

        {hayFiltrosActivos ? (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='h-8 shrink-0 px-2 text-xs'
            onClick={onLimpiar}
          >
            Limpiar filtros
          </Button>
        ) : null}
      </div>
    </div>
  )
}
