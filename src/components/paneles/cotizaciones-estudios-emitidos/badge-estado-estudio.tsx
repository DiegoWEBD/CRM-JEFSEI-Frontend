import { Badge } from '@/components/badge'
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
    <Badge
      variant='outline'
      className={cn(
        'text-[10px] font-medium',
        tieneEstudio
          ? 'border-emerald-500/45 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100'
          : 'border-amber-500/45 bg-amber-500/10 text-amber-950 dark:text-amber-100',
        className,
      )}
    >
      {tieneEstudio ? 'Disponible' : 'Pendiente'}
    </Badge>
  )
}
