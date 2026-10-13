export type EstadoConfiguracion = {
	codigo: string
	nombre: string
	codigo_etapa: string
	nombre_etapa: string
	/** 0..1 */
	probabilidad_cierre: number
	dias_limite: number | null
	rol_responsable: string | null
	nombre_rol_responsable: string | null
	cantidad_transiciones: number
}

export type ObtenerEstadosConfiguracionResponse = {
	data: EstadoConfiguracion[]
}
