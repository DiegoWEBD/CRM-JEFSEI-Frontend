'use client'

import { Label } from '@/components/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import { cn } from '@/lib/utils'

const campoClass = 'min-w-[7.5rem] flex-1 sm:max-w-[11rem]'

export function CommercialActivityFilters({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-end gap-x-2.5 gap-y-2 rounded-lg border border-border/70 bg-background px-2.5 py-2',
        className,
      )}
    >
      <div className={cn(campoClass)}>
        <Label className='mb-0.5 block text-xs text-muted-foreground'>Función</Label>
        <Select defaultValue='ejecutivo_comercial'>
          <SelectTrigger className='h-7 text-xs shadow-none'>
            <SelectValue placeholder='Función' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ejecutivo_comercial' className='text-xs'>Ejecutivo Comercial</SelectItem>
            <SelectItem value='evaluacion_proyectos' className='text-xs'>Evaluación Proyectos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className={cn(campoClass)}>
        <Label className='mb-0.5 block text-xs text-muted-foreground'>Ejecutivo</Label>
        <Select defaultValue='todos'>
          <SelectTrigger className='h-7 text-xs shadow-none'>
            <SelectValue placeholder='Ejecutivo' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='todos' className='text-xs'>Todos los ejecutivos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className={cn(campoClass, 'min-w-[8.5rem]')}>
        <Label className='mb-0.5 block text-xs text-muted-foreground'>Fecha desde</Label>
        <input
          type='date'
          className='flex h-7 w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
        />
      </div>
      <div className={cn(campoClass, 'min-w-[8.5rem]')}>
        <Label className='mb-0.5 block text-xs text-muted-foreground'>Fecha hasta</Label>
        <input
          type='date'
          className='flex h-7 w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
        />
      </div>
    </div>
  )
}
