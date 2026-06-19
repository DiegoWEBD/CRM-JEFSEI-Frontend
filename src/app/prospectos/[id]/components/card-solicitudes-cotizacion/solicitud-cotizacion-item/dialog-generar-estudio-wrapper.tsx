'use client'

import { PanelEstudioFila } from '@/aplicacion/cotizaciones-estudios/dto/panel-estudio-fila'
import DialogGenerarEstudio, {
  type ConfiguracionEstudio,
} from '@/components/paneles/cotizaciones-estudios-emitidos/dialog-generar-estudio'
import type SolicitudCotizacion from '@/dominio/solicitud-cotizacion/solicitud-cotizacion'

type DialogGenerarEstudioWrapperProps = {
  solicitud: SolicitudCotizacion
  idProspecto: number
  nombreCliente: string
  lineaNegocioNombre: string
  nombreEjecutivo: string
  configuracion?: ConfiguracionEstudio
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DialogGenerarEstudioWrapper({
  solicitud,
  idProspecto,
  nombreCliente,
  lineaNegocioNombre,
  nombreEjecutivo,
  configuracion,
  open,
  onOpenChange,
}: DialogGenerarEstudioWrapperProps) {
  const fila: PanelEstudioFila = {
    id: solicitud.id,
    id_prospecto: idProspecto,
    cliente: nombreCliente,
    linea_seguro: lineaNegocioNombre,
    ejecutivo_comercial: nombreEjecutivo,
    cantidad_cotizaciones: solicitud.cantidad_cotizaciones,
    prioridad: solicitud.prioridad,
    fecha: solicitud.fecha,
    tiene_estudio: false,
    id_estudio: null,
    vencimiento_mas_proximo: null,
    estado_vencimiento: null,
  }

  return (
    <DialogGenerarEstudio
      fila={fila}
      open={open}
      onOpenChange={onOpenChange}
      configuracionEstudio={configuracion}
    />
  )
}
