import { Badge } from '@/components/badge'
import { PRIORIDAD_BADGE } from '@/app/styles/estados/prioridad-badge'
import type { Prioridad } from '@/types/prioridad/prioridad'

type BadgePrioridadProps = {
  prioridad: Prioridad
}

const ETIQUETAS: Record<Prioridad, string> = {
  alta: 'Alta',
  normal: 'Normal',
}

export default function BadgePrioridad({ prioridad }: BadgePrioridadProps) {
  return (
    <Badge variant='outline' className={PRIORIDAD_BADGE[prioridad]}>
      {ETIQUETAS[prioridad]}
    </Badge>
  )
}
