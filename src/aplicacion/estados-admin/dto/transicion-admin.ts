export type TransicionAdmin = {
	codigo_estado_origen: string
	codigo_estado_destino: string
	nombre_estado_origen: string | null
	nombre_estado_destino: string
	es_manual: boolean
	es_principal: boolean
	accion_requerida: string | null
	/**
	 * SLA de permanencia en el estado de origen (días).
	 * Solo aplica a la transición principal; en las secundarias es null.
	 */
	dias_limite: number | null
	/**
	 * Roles responsables de las alertas SLA, por tipo de oportunidad.
	 * Solo aplica a la transición principal; en las secundarias están vacíos.
	 */
	roles_responsables_nuevas: string[]
	roles_responsables_renovacion: string[]
}

export type ObtenerTransicionesEstadoResponse = {
	data: TransicionAdmin[]
}
