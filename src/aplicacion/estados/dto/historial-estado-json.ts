import { EstadoComercialProspecto } from '@/types/estados/estado-comercial-cliente'

export interface HistorialEstadoJson {
	estado_anterior?: EstadoComercialProspecto
	estado_actual: EstadoComercialProspecto
	fecha_registro: string
	dias_limite: number
	dias_transcurridos: number
	proxima_accion?: string
	motivo_cambio?: string
	cambiado_por: string
}
