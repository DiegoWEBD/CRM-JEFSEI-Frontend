import { EstadoComercialProspecto } from '@/types/estados/estado-comercial-cliente'

/** Estado general del prospecto/cliente devuelto por el backend. */
export type EstadoGeneralCliente = 'prospecto' | 'cliente_activo' | 'cliente_inactivo'

export const ESTADO_GENERAL_CLIENTE_LABELS: Record<EstadoGeneralCliente, string> = {
	prospecto: 'Prospecto',
	cliente_activo: 'Cliente activo',
	cliente_inactivo: 'Cliente inactivo',
}

export { ESTADO_GENERAL_CLIENTE_VARIANT as ESTADO_GENERAL_CLIENTE_BADGE } from '@/lib/badge-variants'
export type { BadgeVariant } from '@/lib/badge-variants'

/** Estado general visible en el encabezado del perfil comercial. */
export type EstadoGeneralClientePerfil =
	| 'nuevo'
	| 'en_seguimiento'
	| 'en_proceso_comercial'
	| 'cliente_activo'
	| 'perdido'

export const ESTADO_GENERAL_CLIENTE_PERFIL_LABELS: Record<
	EstadoGeneralClientePerfil,
	string
> = {
	nuevo: 'Nuevo',
	en_seguimiento: 'En seguimiento',
	en_proceso_comercial: 'En proceso comercial',
	cliente_activo: 'Cliente activo',
	perdido: 'Cerrado perdido',
}

export { ESTADO_GENERAL_CLIENTE_PERFIL_VARIANT as ESTADO_GENERAL_CLIENTE_PERFIL_BADGE } from '@/lib/badge-variants'

export function estadoGeneralClientePerfilDesdeComercial(
	estado: EstadoComercialProspecto,
): EstadoGeneralClientePerfil {
	switch (estado) {
		case 'OPORTUNIDAD_CREADA':
		case 'CLIENTE_CARGADO_MASIVO':
			return 'nuevo'
		case 'EJECUTIVO_COMERCIAL_ASIGNADO':
		case 'CONTACTADO':
		case 'COTIZACION_DISPONIBLE':
			return 'en_seguimiento'
		case 'COTIZACION_SOLICITADA_COMPANY':
		case 'ESTUDIO_DISPONIBLE':
		case 'ESTUDIO_ENVIADO_CLIENTE':
		case 'RECOTIZACION_SOLICITADA':
		case 'PROPUESTA_ACEPTADA':
			return 'en_proceso_comercial'
		case 'GANADO':
		case 'POLIZA_REGISTRADA':
		case 'PLAN_PAGO_CREADO':
			return 'cliente_activo'
		case 'PERDIDO':
			return 'perdido'
		default:
			return 'nuevo'
	}
}

/** Estado de cotización en cada solicitud del perfil. */
export type EstadoCotizacionPerfilVisual =
	| 'nueva_solicitud'
	| 'cotizacion_generada'

export const ESTADO_COTIZACION_PERFIL_LABELS: Record<
	EstadoCotizacionPerfilVisual,
	string
> = {
	nueva_solicitud: 'Nueva solicitud',
	cotizacion_generada: 'Cotización generada',
}

export { ESTADO_COTIZACION_PERFIL_VARIANT as ESTADO_COTIZACION_PERFIL_BADGE } from '@/lib/badge-variants'

/** Estados visibles en la sección y modal «Ver solicitud» del perfil comercial. */
export type EstadoSolicitudCotizacionPerfil =
	| 'sin_cotizacion_solicitada'
	| 'solicitud_registrada'
	| 'estudio_disponible'
	| 'estudio_enviado_cliente'
	| 'recotizacion_solicitada'
	| 'ganado'
	| 'perdido'

export const ESTADO_SOLICITUD_COTIZACION_PERFIL_LABELS: Record<
	EstadoSolicitudCotizacionPerfil,
	string
> = {
	sin_cotizacion_solicitada: 'Sin cotización solicitada',
	solicitud_registrada: 'Solicitud REGISTRADA',
	estudio_disponible: 'Estudio disponible',
	estudio_enviado_cliente: 'Estudio enviado al cliente',
	recotizacion_solicitada: 'Recotización solicitada',
	ganado: 'Cerrado ganado',
	perdido: 'Cerrado perdido',
}

export function estadoCotizacionPerfilDesdeSolicitud(
	estado: EstadoSolicitudCotizacionPerfil,
): EstadoCotizacionPerfilVisual {
	if (
		estado === 'estudio_disponible' ||
		estado === 'estudio_enviado_cliente' ||
		estado === 'ganado'
	) {
		return 'cotizacion_generada'
	}
	return 'nueva_solicitud'
}

/** Estado de estudio asociado a una solicitud. */
export type EstadoEstudioPerfilVisual =
	| 'estudio_disponible'
	| 'estudio_enviado_cliente'
	| 'recotizacion_solicitada'
	| 'perdido'

export const ESTADO_ESTUDIO_PERFIL_LABELS: Record<
	EstadoEstudioPerfilVisual,
	string
> = {
	estudio_disponible: 'Estudio disponible',
	estudio_enviado_cliente: 'Estudio enviado al cliente',
	recotizacion_solicitada: 'Recotización solicitada',
	perdido: 'Cerrado perdido',
}

export { ESTADO_ESTUDIO_PERFIL_VARIANT as ESTADO_ESTUDIO_PERFIL_BADGE } from '@/lib/badge-variants'

/*export function estadoEstudioPerfilDesdeLinea(
	line: LineaSeguroClienteMock,
	opts?: { solicitudTieneEstudioEmitido?: (solicitudId: string) => boolean },
): EstadoEstudioPerfilVisual | null {
	const estado = resolverEstadoCotizacionLinea(line, opts)
	switch (estado) {
		case 'estudio_disponible':
			return 'estudio_disponible'
		case 'estudio_enviado_cliente':
			return 'estudio_enviado_cliente'
		case 'recotizacion_solicitada':
			return 'recotizacion_solicitada'
		case 'perdido':
			return 'perdido'
		default:
			return null
	}
}*/

/** Estado de póliza en el listado del perfil. */
export type EstadoPoliza =
	| 'REGISTRADA'
	| 'VIGENTE'
	| 'POR_VENCER'
	| 'VENCIDA'
	| 'CANCELADA'

export const ESTADO_POLIZA_PERFIL_LABELS: Record<EstadoPoliza, string> = {
	REGISTRADA: 'Registrada',
	VIGENTE: 'Vigente',
	POR_VENCER: 'Por vencer',
	VENCIDA: 'Vencida',
	CANCELADA: 'Cancelada',
}

export { ESTADO_POLIZA_PERFIL_VARIANT as ESTADO_POLIZA_PERFIL_BADGE } from '@/lib/badge-variants'

/*export function estadoPolizaPerfilDesdeMostrado(
	estado: EstadoPolizaCliente,
): EstadoPoliza {
	switch (estado) {
		case 'En trámite':
			return 'REGISTRADA'
		case 'Vigente':
			return 'VIGENTE'
		case 'Por vencer':
			return 'POR_VENCER'
		case 'Vencida':
			return 'VENCIDA'
		case 'Cancelada':
			return 'CANCELADA'
		default:
			return 'REGISTRADA'
	}
}

export function resolverEstadosSolicitudLineaPerfil(
	line: LineaSeguroClienteMock,
	opts?: { solicitudTieneEstudioEmitido?: (solicitudId: string) => boolean },
) {
	const estadoSolicitud = estadoSolicitudCotizacionPerfil(line, opts)
	const estadoCotizacion = estadoCotizacionPerfilDesdeSolicitud(estadoSolicitud)
	const estadoEstudio = estadoEstudioPerfilDesdeLinea(line, opts)
	return { estadoSolicitud, estadoCotizacion, estadoEstudio }
}
*/
