import { SeccionEstudioComercialRequest } from './seccion-estudio-comercial-request'

export interface ArmarEstudioComercialRequest {
  id_prospecto: number
  infraseguro_primer_ejemplo: number
  infraseguro_segundo_ejemplo: number
  cantidad_cuotas: number
  ids_cotizacion: number[]
  valor_uf: number
  secciones: SeccionEstudioComercialRequest[]
}
