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
	id_prospecto: number | null
	dedupe_key: string
	leida: boolean
	fecha_leida: string | null
	created_at: string
	leible: boolean
}

export interface ObtenerNotificacionesResponse {
	data: Notificacion[]
	total: number
	pagina: number
	tamano_pagina: number
	total_paginas: number
}

export interface ObtenerContadorNoLeidasResponse {
	no_leidas: number
	no_leibles: number
}

/** Ticket efímero que autoriza abrir el WebSocket de notificaciones. */
export interface TicketWebSocketResponse {
	ticket: string
	/** Segundos de vida útil del ticket. */
	expira_en: number
}

/** Mensaje que envía el backend por el WebSocket. */
export interface EventoCanalNotificaciones {
	evento: string
	motivo?: string
}

export interface MarcarLeidaResponse {
	message: string
}

export interface MarcarTodasLeidasResponse {
	message: string
	total: number
}
