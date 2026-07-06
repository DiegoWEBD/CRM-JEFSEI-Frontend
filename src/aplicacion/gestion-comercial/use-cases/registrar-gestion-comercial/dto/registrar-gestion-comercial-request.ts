export interface RegistrarGestionComercialRequest {
  tipo: 'llamada' | 'correo' | 'visita' | 'mensaje'
  id_prospecto: number
  titulo: string
  estado_contacto?: string | null
  observacion?: string | null
  fecha_gestion: string
}
