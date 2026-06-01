import { EstadoComercialProspecto } from '@/types/estados/estado-comercial-cliente'

export interface ProspectoResumenJson {
	id: number
	nombre_riesgo: string
	nombre_contacto: string
	linea_negocio: string
	codigo_estado: EstadoComercialProspecto
	nombre_estado: string
	dias_limite: number
	dias_transcurridos: number
	fecha_ultima_accion: string
	proxima_accion: string
}
