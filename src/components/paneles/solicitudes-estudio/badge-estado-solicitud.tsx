export type EstadoSolicitudBandeja =
  | 'informacion_incompleta'
  | 'lista_para_cotizar'
  | 'con_cotizaciones'
  | 'estudio_emitido'

export const ESTADO_BANDEJA_LABELS: Record<EstadoSolicitudBandeja, string> = {
  informacion_incompleta: 'Pendiente información',
  lista_para_cotizar: 'Lista para cotizar',
  con_cotizaciones: 'Con cotizaciones',
  estudio_emitido: 'Estudio emitido',
}

const BADGE_CLASSES: Record<EstadoSolicitudBandeja, string> = {
  informacion_incompleta:
    'border-amber-500/45 bg-amber-500/10 text-amber-950 dark:text-amber-100',
  lista_para_cotizar:
    'border-blue-500/35 bg-blue-500/10 text-blue-950 dark:text-blue-100',
  con_cotizaciones:
    'border-emerald-500/45 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100',
  estudio_emitido:
    'border-violet-500/35 bg-violet-500/10 text-violet-950 dark:text-violet-100',
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
