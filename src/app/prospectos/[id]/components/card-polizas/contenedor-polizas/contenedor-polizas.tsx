'use client'

import { Button } from '@/components/button'
import Poliza from '@/dominio/poliza/poliza'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import ItemPoliza, { filaPolizaGridClass } from './item-poliza/item-poliza'
import { useAgruparPolizasPorProducto } from '@/hooks/polizas/use-agrupar-polizas-por-producto'

const UMBRAL_SCROLL = 5
const ALTURA_MAX_LISTA = 'max-h-[min(320px,42vh)]'

type ContenedorPolizasProps = {
  polizas?: Poliza[]
}

function EncabezadoFilas() {
  return (
    <div
      className={cn(
        filaPolizaGridClass,
        'mb-1 hidden px-2 text-[9px] font-medium uppercase tracking-wide text-muted-foreground sm:grid',
      )}
    >
      <span>Nº póliza</span>
      <span>Compañía</span>
      <span>Estado</span>
      <span>Vencimiento</span>
      <span>Prima / monto</span>
      <span className='text-right'>Acción</span>
    </div>
  )
}

export default function ContenedorPolizas({
  polizas,
}: ContenedorPolizasProps) {
  const { polizasPorProductos } = useAgruparPolizasPorProducto(polizas)
  const [gruposExpandidos, setGruposExpandidos] = useState<Set<string>>(
    () => new Set(),
  )

  const gruposVisibles = polizasPorProductos.filter(
    (g) => g.polizas.length > 0,
  )

  const totalPolizas = useMemo(
    () => gruposVisibles.reduce((acc, g) => acc + g.polizas.length, 0),
    [gruposVisibles],
  )

  const toggleGrupo = (producto: string) => {
    setGruposExpandidos((prev) => {
      const next = new Set(prev)
      if (next.has(producto)) next.delete(producto)
      else next.add(producto)
      return next
    })
  }

  const expandirTodos = () => {
    setGruposExpandidos(new Set(gruposVisibles.map((g) => g.producto)))
  }

  const contraerTodos = () => {
    setGruposExpandidos(new Set())
  }

  if (gruposVisibles.length === 0) {
    return (
      <p className='rounded-md border border-dashed border-border/70 bg-muted/10 px-2.5 py-2 text-xs text-muted-foreground'>
        Aún no hay pólizas registradas para este cliente.
      </p>
    )
  }

  return (
    <div className='space-y-2.5'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <p className='text-[10px] text-muted-foreground sm:text-[11px]'>
          Mostrando{' '}
          <span className='font-medium tabular-nums text-foreground'>
            {totalPolizas}
          </span>{' '}
          póliza{totalPolizas === 1 ? '' : 's'}
        </p>
        {gruposVisibles.length > 0 ? (
          <div className='flex shrink-0 items-center gap-1'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='h-7 px-2 text-[10px]'
              onClick={expandirTodos}
            >
              Expandir todas
            </Button>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='h-7 px-2 text-[10px]'
              onClick={contraerTodos}
            >
              Contraer todas
            </Button>
          </div>
        ) : null}
      </div>

      <ul className='space-y-2.5'>
        {gruposVisibles.map((grupo) => {
          const expandido = gruposExpandidos.has(grupo.producto)
          const usarScroll = grupo.polizas.length > UMBRAL_SCROLL

          return (
            <li
              key={grupo.producto}
              className='overflow-hidden rounded-lg border border-border/80 bg-muted/[0.06] shadow-none'
            >
              <button
                type='button'
                onClick={() => toggleGrupo(grupo.producto)}
                className={cn(
                  'flex w-full items-center gap-2 bg-muted/20 px-3 py-2.5 text-left transition-colors hover:bg-muted/30',
                  expandido && 'border-b border-border/60',
                )}
                aria-expanded={expandido}
              >
                {expandido ? (
                  <ChevronDown
                    className='h-4 w-4 shrink-0 text-muted-foreground'
                    aria-hidden
                  />
                ) : (
                  <ChevronRight
                    className='h-4 w-4 shrink-0 text-muted-foreground'
                    aria-hidden
                  />
                )}
                <span className='min-w-0 flex-1 text-xs font-semibold text-foreground'>
                  {grupo.producto}
                  <span className='font-normal text-muted-foreground'>
                    {' '}
                    — {grupo.polizas.length} póliza
                    {grupo.polizas.length === 1 ? '' : 's'}
                  </span>
                </span>
              </button>

              {expandido && (
                <div className='overflow-x-auto px-2 py-2'>
                  <EncabezadoFilas />
                  <ul
                    className={cn(
                      'space-y-1.5',
                      usarScroll &&
                        cn(ALTURA_MAX_LISTA, 'overflow-y-auto pr-1'),
                    )}
                  >
                    {grupo.polizas.map((poliza) => (
                      <ItemPoliza
                        key={poliza.numero_poliza}
                        poliza={poliza}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
