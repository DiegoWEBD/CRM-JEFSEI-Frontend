export interface SolicitudCotizacionRequestBase {
  id_prospecto: number
  prioridad: string
  observaciones?: string | null
  tipo: string
  motivo_recotizacion?: string | null
  id_solicitud_previa?: number | null
}
