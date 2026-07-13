'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import { Button } from '@/components/button'
import { cn } from '@/lib/utils'
import type { Prioridad } from '@/types/prioridad/prioridad'
import { ESTADO_BANDEJA_LABELS } from './badge-estado-solicitud'

export const TODOS = '__todos__'

export type FiltrosSolicitudes = {
  busqueda: string
  estado: string
  prioridad: string
  ejecutivo: string
  linea: string
}

type FiltrosSolicitudesEstudioProps = {
  filtros: FiltrosSolicitudes
  onChange: (filtros: FiltrosSolicitudes) => void
  opcionesEjecutivo: string[]
  opcionesLinea: string[]
  total: number
  filtrados: number
}

const ESTADOS = ['informacion_incompleta', 'lista_para_cotizar', 'con_cotizaciones', 'estudio_emitido'] as const

const PRIORIDADES: Prioridad[] = ['alta', 'normal']

export default function FiltrosSolicitudesEstudio({
  filtros,
  onChange,
  opcionesEjecutivo,
  opcionesLinea,
  total,
  filtrados,
}: FiltrosSolicitudesEstudioProps) {
  const hayFiltrosActivos =
    filtros.busqueda.trim() !== '' ||
    filtros.estado !== TODOS ||
    filtros.prioridad !== TODOS ||
    filtros.ejecutivo !== TODOS ||
    filtros.linea !== TODOS

  const limpiarFiltros = () => {
    onChange({
      busqueda: '',
      estado: TODOS,
      prioridad: TODOS,
      ejecutivo: TODOS,
      linea: TODOS,
    })
  }

  const actualizar = (patch: Partial<FiltrosSolicitudes>) => {
    onChange({ ...filtros, ...patch })
  }

  return (
    <div className='space-y-3'>
      <div className='relative'>
        <Search
          className='pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground'
          aria-hidden
        />
        <Input
          className='h-9 pl-8 text-sm shadow-none'
          placeholder='Buscar por cliente, línea de seguro o ejecutivo comercial...'
          value={filtros.busqueda}
          onChange={(e) => actualizar({ busqueda: e.target.value })}
        />
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <Select
          value={filtros.estado}
          onValueChange={(value) => actualizar({ estado: value })}
        >
          <SelectTrigger size='sm' className='h-8 w-[min(100%,180px)] text-xs shadow-none'>
            <SelectValue placeholder='Estado' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS} className='text-xs'>
              Estado: todos
            </SelectItem>
            {ESTADOS.map((e) => (
              <SelectItem key={e} value={e} className='text-xs'>
                {ESTADO_BANDEJA_LABELS[e]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filtros.prioridad}
          onValueChange={(value) => actualizar({ prioridad: value })}
        >
          <SelectTrigger size='sm' className='h-8 w-[min(100%,140px)] text-xs shadow-none'>
            <SelectValue placeholder='Prioridad' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS} className='text-xs'>
              Prioridad: todas
            </SelectItem>
            {PRIORIDADES.map((p) => (
              <SelectItem key={p} value={p} className='text-xs capitalize'>
                {p === 'alta' ? 'Alta' : 'Normal'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filtros.ejecutivo}
          onValueChange={(value) => actualizar({ ejecutivo: value })}
        >
          <SelectTrigger
            size='sm'
            className='h-8 w-[min(100%,160px)] text-xs shadow-none'
          >
            <SelectValue placeholder='Ejecutivo' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS} className='text-xs'>
              Ejecutivo: todos
            </SelectItem>
            {opcionesEjecutivo.map((e) => (
              <SelectItem key={e} value={e} className='text-xs'>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filtros.linea}
          onValueChange={(value) => actualizar({ linea: value })}
        >
          <SelectTrigger
            size='sm'
            className='h-8 w-[min(100%,160px)] text-xs shadow-none'
          >
            <SelectValue placeholder='Línea' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS} className='text-xs'>
              Línea: todas
            </SelectItem>
            {opcionesLinea.map((l) => (
              <SelectItem key={l} value={l} className='text-xs'>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hayFiltrosActivos ? (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='h-8 gap-1 px-2 text-xs text-muted-foreground'
            onClick={limpiarFiltros}
          >
            <X className='h-3.5 w-3.5' aria-hidden />
            Limpiar
          </Button>
        ) : null}
      </div>

      <p className='text-[11px] text-muted-foreground'>
        Mostrando {filtrados} de {total} solicitudes de cotización
      </p>
    </div>
  )
}
