export type TransicionAdmin = {
	codigo_estado_origen: string
	codigo_estado_destino: string
	nombre_estado_origen: string | null
	nombre_estado_destino: string
	es_manual: boolean
	es_principal: boolean
	accion_requerida: string | null
}

export type ObtenerTransicionesEstadoResponse = {
	data: TransicionAdmin[]
}
