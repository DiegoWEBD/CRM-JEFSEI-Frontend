export type NivelNotificacion = 'INFO' | 'AVISO' | 'CRITICO'

export interface Notificacion {
	id: number
	rut_usuario: string
	codigo_tipo: string
	nivel: NivelNotificacion
	titulo: string
	mensaje: string
	entidad_tipo: string | null
	entidad_id: number | null
	url_destino: string | null
	dedupe_key: string
	leida: boolean
	fecha_leida: string | null
	created_at: string
}

export interface ObtenerNotificacionesResponse {
	data: Notificacion[]
	total: number
	pagina: number
	tamano_pagina: number
	total_paginas: number
}

export interface ObtenerContadorNoLeidasResponse {
	contador: number
}

export interface MarcarLeidaResponse {
	message: string
}

export interface MarcarTodasLeidasResponse {
	message: string
	total: number
}
