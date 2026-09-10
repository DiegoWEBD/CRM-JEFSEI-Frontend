export interface RegistrarCotizacionRequest {
  tipo: 'tasa' | 'prima'
  monto_total_asegurado: number
  prima_adicional_asistencia: number
  id_company: number
  fecha_emision: string
  fecha_vencimiento: string
  tasa_afecta?: number
  tasa_excenta?: number
  tasa_politica?: number
  prima_afecta?: number
  prima_excenta?: number
  archivo?: File
}
