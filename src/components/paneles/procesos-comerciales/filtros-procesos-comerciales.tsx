'use client'

import { Input } from '@/components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/button'

export const TODOS = '__todos__'

export type FiltrosPanel = {
  busqueda: string
  ejecutivo: string
  etapa: string
}

type FiltrosProcesosComercialesProps = {
  filtros: FiltrosPanel
  onChange: (f: FiltrosPanel) => void
  opcionesEjecutivo: string[]
  opcionesEtapa: string[]
}

export default function FiltrosProcesosComerciales({
  filtros,
  onChange,
  opcionesEjecutivo,
  opcionesEtapa,
}: FiltrosProcesosComercialesProps) {
  const actualizar = (key: keyof FiltrosPanel, value: string) => {
    onChange({ ...filtros, [key]: value })
  }

  const limpiar = () => {
    onChange({
      busqueda: '',
      ejecutivo: TODOS,
      etapa: TODOS,
    })
  }

  const hayFiltros =
    filtros.busqueda !== '' ||
    filtros.ejecutivo !== TODOS ||
    filtros.etapa !== TODOS

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <div className='relative flex-1'>
        <Search className='pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground' />
        <Input
          placeholder='Buscar por cliente, ejecutivo, producto...'
          value={filtros.busqueda}
          onChange={(e) => actualizar('busqueda', e.target.value)}
          className='h-9 pl-8 text-xs'
        />
      </div>

      <Select
        value={filtros.ejecutivo}
        onValueChange={(v) => actualizar('ejecutivo', v)}
      >
        <SelectTrigger className='h-9 w-36 text-xs'>
          <SelectValue placeholder='Ejecutivo' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TODOS} className='text-xs'>
            Todos
          </SelectItem>
          {opcionesEjecutivo.map((op) => (
            <SelectItem key={op} value={op} className='text-xs'>
              {op}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filtros.etapa}
        onValueChange={(v) => actualizar('etapa', v)}
      >
        <SelectTrigger className='h-9 w-32 text-xs'>
          <SelectValue placeholder='Etapa' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TODOS} className='text-xs'>
            Todas
          </SelectItem>
          {opcionesEtapa.map((op) => (
            <SelectItem key={op} value={op} className='text-xs'>
              {op}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hayFiltros && (
        <Button
          variant='ghost'
          size='sm'
          onClick={limpiar}
          className='h-9 px-2 text-xs text-muted-foreground'
        >
          <X className='mr-1 h-3.5 w-3.5' />
          Limpiar
        </Button>
      )}
    </div>
  )
}
