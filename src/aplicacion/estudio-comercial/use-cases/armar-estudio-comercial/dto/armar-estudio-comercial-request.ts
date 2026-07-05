import { SeccionEstudioComercialRequest } from './seccion-estudio-comercial-request'

export interface ArmarEstudioComercialRequest {
  id_prospecto: number
  monto_asegurado_actual: number | null
  con_monto_sugerido: boolean
  infraseguro_primer_ejemplo: number | null
  infraseguro_segundo_ejemplo: number | null
  cantidad_cuotas: number
  ids_cotizacion: number[]
  valor_uf: number
  secciones: SeccionEstudioComercialRequest[] | null
}
