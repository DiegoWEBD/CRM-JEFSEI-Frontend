export interface GestionComercialJson {
  id: number
  tipo: string
  rut_usuario: string
  nombre_ejecutivo: string | null
  id_prospecto: number
  nombre_cliente: string | null
  titulo: string
  estado_contacto: string | null
  observacion: string | null
  created_at: string
  fecha_gestion: string
}
