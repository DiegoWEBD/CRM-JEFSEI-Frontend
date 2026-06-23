import Cotizacion from '@/dominio/cotizacion/cotizacion'

export interface DetalleEstudioComercialCondominioJson {
  cotizacion: Cotizacion
  porcentaje_infraseguro: number
  iva_prima_afecta: number
  prima_neta: number
  prima_bruta: number
}
