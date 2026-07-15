import { Badge } from '@/components/badge'
import { PRIORIDAD_VARIANT } from '@/lib/badge-variants'
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
    <Badge variant={PRIORIDAD_VARIANT[prioridad]}>
      {ETIQUETAS[prioridad]}
    </Badge>
  )
}
