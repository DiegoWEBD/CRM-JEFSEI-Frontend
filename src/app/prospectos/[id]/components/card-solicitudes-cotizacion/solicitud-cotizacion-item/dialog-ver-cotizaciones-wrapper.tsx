'use client'

import { PanelEstudioFila } from '@/aplicacion/cotizaciones-estudios/dto/panel-estudio-fila'
import DialogVerCotizaciones from '@/components/paneles/cotizaciones-estudios-emitidos/dialog-ver-cotizaciones'
import type SolicitudCotizacion from '@/dominio/solicitud-cotizacion/solicitud-cotizacion'

type DialogVerCotizacionesWrapperProps = {
  solicitud: SolicitudCotizacion
  nombreCliente: string
  lineaNegocioNombre: string
  nombreEjecutivo: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DialogVerCotizacionesWrapper({
  solicitud,
  nombreCliente,
  lineaNegocioNombre,
  nombreEjecutivo,
  open,
  onOpenChange,
}: DialogVerCotizacionesWrapperProps) {
  const fila: PanelEstudioFila = {
    id: solicitud.id,
    id_prospecto: 0,
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
    <DialogVerCotizaciones
      fila={fila}
      open={open}
      onOpenChange={onOpenChange}
    />
  )
}
