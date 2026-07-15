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

import { Badge } from '@/components/badge'
import { BANDEJA_SOLICITUD_VARIANT } from '@/lib/badge-variants'

type BadgeEstadoSolicitudProps = {
  estado: EstadoSolicitudBandeja
}

export default function BadgeEstadoSolicitud({
  estado,
}: BadgeEstadoSolicitudProps) {
  return (
    <Badge variant={BANDEJA_SOLICITUD_VARIANT[estado]}>
      {ESTADO_BANDEJA_LABELS[estado]}
    </Badge>
  )
}
