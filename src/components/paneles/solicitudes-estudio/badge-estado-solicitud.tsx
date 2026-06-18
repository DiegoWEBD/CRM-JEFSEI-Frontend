export type EstadoSolicitudBandeja =
  | 'informacion_incompleta'
  | 'lista_para_cotizar'
  | 'con_cotizaciones'

export const ESTADO_BANDEJA_LABELS: Record<EstadoSolicitudBandeja, string> = {
  informacion_incompleta: 'Pendiente información',
  lista_para_cotizar: 'Lista para cotizar',
  con_cotizaciones: 'Con cotizaciones',
}

const BADGE_CLASSES: Record<EstadoSolicitudBandeja, string> = {
  informacion_incompleta:
    'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200',
  lista_para_cotizar:
    'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-200',
  con_cotizaciones:
    'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
}

import { Badge } from '@/components/badge'

type BadgeEstadoSolicitudProps = {
  estado: EstadoSolicitudBandeja
}

export default function BadgeEstadoSolicitud({
  estado,
}: BadgeEstadoSolicitudProps) {
  return (
    <Badge variant='outline' className={BADGE_CLASSES[estado]}>
      {ESTADO_BANDEJA_LABELS[estado]}
    </Badge>
  )
}
