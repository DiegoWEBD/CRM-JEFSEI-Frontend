export interface RegistrarCotizacionRequest {
  monto_total_asegurado: number
  tasa_afecta: number
  tasa_excenta: number
  tasa_politica: number
  prima_adicional_asistencia: number
  id_company: number
  fecha_emision: string
  fecha_vencimiento: string
}
