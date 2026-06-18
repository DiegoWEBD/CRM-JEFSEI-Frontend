import { cn } from '@/lib/utils'

type BadgeEstadoEstudioProps = {
  tieneEstudio: boolean
  className?: string
}

export default function BadgeEstadoEstudio({
  tieneEstudio,
  className,
}: BadgeEstadoEstudioProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none',
        tieneEstudio
          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-400/20'
          : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-400/20',
        className,
      )}
    >
      {tieneEstudio ? 'Disponible' : 'Pendiente'}
    </span>
  )
}
