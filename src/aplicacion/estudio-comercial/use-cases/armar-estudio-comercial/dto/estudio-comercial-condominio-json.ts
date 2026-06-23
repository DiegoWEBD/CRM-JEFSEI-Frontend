import { DetalleEstudioComercialCondominioJson } from './detalle-estudio-comercial-condominio-json'

export interface EstudioComercialCondominioJson {
  cantidad_cuotas: number
  valor_uf: number
  detalles: DetalleEstudioComercialCondominioJson[]
}
