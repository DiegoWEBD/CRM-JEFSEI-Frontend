import { EstadoComercialProspecto } from '@/types/estados/estado-comercial-cliente'
import type { EtapaProcesoComercialJson } from './etapa-proceso-comercial-json'

export interface EstadoInformativoJson {
	codigo: EstadoComercialProspecto
	nombre: string
	etapa: EtapaProcesoComercialJson
}
