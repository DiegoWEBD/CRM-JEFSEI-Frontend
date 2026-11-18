import { cn } from '@/lib/utils'
import { Skeleton } from './skeleton'

type SkeletonFilaTablaProps = {
  /** Cantidad de celdas/campos que representa la fila */
  celdas?: number
  /**
   * 'tabla' renderiza la fila como <tr>/<td> para el <tbody> de una tabla.
   * 'lista' renderiza la fila como <li> con la silueta de un item de lista.
   */
  contexto?: 'tabla' | 'lista'
  /** Clase extra para la fila ('tabla') o para el grid de celdas ('lista') */
  className?: string
}

type SkeletonFilasTablaProps = SkeletonFilaTablaProps & {
  cantidad?: number
}

const ANCHOS_CELDA = ['w-20', 'w-28', 'w-24', 'w-16', 'w-28', 'w-20', 'w-24']

function anchoCelda(indice: number) {
  return ANCHOS_CELDA[indice % ANCHOS_CELDA.length]
}

/**
 * Fila skeleton reutilizable. Se renderiza dentro del shell real (headers,
 * paginación y controles visibles) mientras se hace un fetch client-side
 * (filtrar, buscar, paginar).
 */
export function SkeletonFilaTabla({
  celdas = 7,
  contexto = 'tabla',
  className,
}: SkeletonFilaTablaProps) {
  const barras = Array.from({ length: celdas }).map((_, i) => (
    <Skeleton key={i} className={cn('h-3', anchoCelda(i))} />
  ))

  if (contexto === 'lista') {
    return (
      <li className="rounded-md border border-border/60 bg-background px-2 py-1.5">
        {/* Mobile */}
        <div className="flex flex-col gap-1 sm:hidden">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
        {/* Desktop */}
        <div className="hidden sm:block">
          <div
            className={cn(
              'grid grid-cols-6 items-center gap-2 sm:gap-3',
              className,
            )}
          >
            {barras}
          </div>
        </div>
      </li>
    )
  }

  return (
    <tr className={cn('border-b border-border/40 last:border-b-0', className)}>
      {Array.from({ length: celdas }).map((_, i) => (
        <td key={i} className="px-3 py-2">
          <Skeleton className={cn('h-3', anchoCelda(i))} />
        </td>
      ))}
    </tr>
  )
}

/**
 * Filas skeleton para el <tbody> de una tabla o para una lista. Se renderizan
 * dentro del shell real mientras se hace un fetch client-side (filtrar,
 * buscar, paginar).
 */
export function SkeletonFilasTabla({
  cantidad = 10,
  ...propsFila
}: SkeletonFilasTablaProps) {
  return (
    <>
      {Array.from({ length: cantidad }).map((_, i) => (
        <SkeletonFilaTabla key={i} {...propsFila} />
      ))}
    </>
  )
}
