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
      variant={tieneEstudio ? 'pastel-emerald' : 'pastel-amber'}
      className={cn('text-[10px] font-medium', className)}
    >
      {tieneEstudio ? 'Disponible' : 'Pendiente'}
    </Badge>
  )
}
