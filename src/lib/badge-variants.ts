import type { EstadoComercialProspecto } from '@/types/estados/estado-comercial-cliente'
import type { Prioridad } from '@/types/prioridad/prioridad'
import type {
	SharedReminderStatus,
	SharedReminderPriority,
} from '@/types/shared/shared-reminders'
import type {
	EstadoGeneralCliente,
	EstadoGeneralClientePerfil,
	EstadoCotizacionPerfilVisual,
	EstadoEstudioPerfilVisual,
	EstadoPoliza,
} from '@/lib/estados-cotizaciones'
import type { EstadoSolicitudBandeja } from '@/components/paneles/solicitudes-estudio/badge-estado-solicitud'

export type BadgeVariant =
	| 'pastel-emerald'
	| 'pastel-amber'
	| 'pastel-red'
	| 'pastel-blue'
	| 'pastel-sky'
	| 'pastel-indigo'
	| 'pastel-violet'
	| 'pastel-fuchsia'
	| 'pastel-cyan'
	| 'pastel-teal'
	| 'pastel-orange'
	| 'pastel-slate'
	| 'pastel-muted'

export const ESTADO_COMERCIAL_VARIANT: Record<
	EstadoComercialProspecto,
	BadgeVariant
> = {
	COTIZACION_DISPONIBLE: 'pastel-orange',
	CONTACTADO: 'pastel-sky',
	ESTUDIO_DISPONIBLE: 'pastel-blue',
	RECOTIZACION_SOLICITADA: 'pastel-amber',
	CLIENTE_CARGADO_MASIVO: 'pastel-slate',
	GANADO: 'pastel-emerald',
	PERDIDO: 'pastel-muted',
	COTIZACION_SOLICITADA_COMPANY: 'pastel-fuchsia',
	ESTUDIO_ENVIADO_CLIENTE: 'pastel-violet',
	EJECUTIVO_COMERCIAL_ASIGNADO: 'pastel-cyan',
	OPORTUNIDAD_CREADA: 'pastel-slate',
	PROPUESTA_ACEPTADA: 'pastel-teal',
	POLIZA_REGISTRADA: 'pastel-emerald',
	PLAN_PAGO_CREADO: 'pastel-emerald',
}

export const PRIORIDAD_VARIANT: Record<Prioridad, BadgeVariant> = {
	normal: 'pastel-amber',
	alta: 'pastel-red',
}

export const ESTADO_GENERAL_CLIENTE_VARIANT: Record<
	EstadoGeneralCliente,
	BadgeVariant
> = {
	prospecto: 'pastel-amber',
	cliente_activo: 'pastel-emerald',
	cliente_inactivo: 'pastel-red',
}

export const ESTADO_GENERAL_CLIENTE_PERFIL_VARIANT: Record<
	EstadoGeneralClientePerfil,
	BadgeVariant
> = {
	nuevo: 'pastel-slate',
	en_seguimiento: 'pastel-sky',
	en_proceso_comercial: 'pastel-indigo',
	cliente_activo: 'pastel-emerald',
	perdido: 'pastel-muted',
}

export const ESTADO_COTIZACION_PERFIL_VARIANT: Record<
	EstadoCotizacionPerfilVisual,
	BadgeVariant
> = {
	nueva_solicitud: 'pastel-violet',
	cotizacion_generada: 'pastel-blue',
}

export const ESTADO_ESTUDIO_PERFIL_VARIANT: Record<
	EstadoEstudioPerfilVisual,
	BadgeVariant
> = {
	estudio_disponible: 'pastel-blue',
	estudio_enviado_cliente: 'pastel-violet',
	recotizacion_solicitada: 'pastel-amber',
	perdido: 'pastel-muted',
}

export const ESTADO_POLIZA_PERFIL_VARIANT: Record<EstadoPoliza, BadgeVariant> =
	{
		REGISTRADA: 'pastel-sky',
		VIGENTE: 'pastel-emerald',
		POR_VENCER: 'pastel-amber',
		VENCIDA: 'pastel-muted',
		CANCELADA: 'pastel-red',
	}

export const VENCIMIENTO_VARIANT: Record<string, BadgeVariant> = {
	vigente: 'pastel-emerald',
	por_vencer: 'pastel-amber',
	vencida: 'pastel-red',
}

export const REMINDER_STATUS_VARIANT: Record<
	SharedReminderStatus,
	BadgeVariant
> = {
	atrasado: 'pastel-red',
	pendiente: 'pastel-amber',
	realizado: 'pastel-emerald',
}

export const REMINDER_PRIORITY_VARIANT: Record<
	SharedReminderPriority,
	BadgeVariant
> = {
	normal: 'pastel-blue',
	alta: 'pastel-red',
}

export const SEMAFORO_VARIANT: Record<string, BadgeVariant> = {
	ROJO: 'pastel-red',
	AMARILLO: 'pastel-amber',
	VERDE: 'pastel-emerald',
	NO_APLICA: 'pastel-muted',
}

export const BANDEJA_SOLICITUD_VARIANT: Record<
	EstadoSolicitudBandeja,
	BadgeVariant
> = {
	informacion_incompleta: 'pastel-amber',
	lista_para_cotizar: 'pastel-blue',
	con_cotizaciones: 'pastel-emerald',
	estudio_emitido: 'pastel-violet',
}

export const SEGUIMIENTO_VARIANT: Record<string, BadgeVariant> = {
	sin_iniciado: 'pastel-slate',
	en_seguimiento: 'pastel-blue',
}
