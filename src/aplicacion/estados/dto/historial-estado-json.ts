export interface HistorialEstadoJson {
	estado_anterior?: string
	estado_actual: string
	color: string
	fecha_registro: string
	dias_limite: number
	dias_transcurridos: number
	proxima_accion?: string
	motivo_cambio?: string
	cambiado_por: string
}
