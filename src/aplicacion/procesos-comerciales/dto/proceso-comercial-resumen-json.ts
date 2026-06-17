import { EstadoComercialProspecto } from '@/types/estados/estado-comercial-cliente'

export interface ProcesoComercialResumenJson {
	id: number
	codigo_estado: EstadoComercialProspecto
	nombre_estado: string
	fecha_ultima_accion: string
}
