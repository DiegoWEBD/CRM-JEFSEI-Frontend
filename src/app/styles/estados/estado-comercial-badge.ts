import { EstadoComercialProspecto } from '@/types/estados/estado-comercial-cliente'

export const ESTADO_COMERCIAL_BADGE: Record<EstadoComercialProspecto, string> =
	{
		COTIZACION_DISPONIBLE:
			'border-orange-500/40 bg-orange-500/10 text-orange-950 dark:text-orange-100',
		CONTACTADO:
			'border-sky-500/35 bg-sky-500/10 text-sky-950 dark:text-sky-100',
		ESTUDIO_DISPONIBLE:
			'border-blue-600/35 bg-blue-600/10 text-blue-950 dark:text-blue-100',
		RECOTIZACION_SOLICITADA:
			'border-amber-500/45 bg-amber-500/10 text-amber-950 dark:text-amber-100',
		CLIENTE_CARGADO_MASIVO:
			'border-slate-400/35 bg-slate-400/10 text-slate-900 dark:text-slate-100',
		GANADO:
			'border-emerald-700/45 bg-emerald-700/15 text-emerald-950 dark:text-emerald-100',
		PERDIDO: 'border-border bg-muted/50 text-muted-foreground',
		COTIZACION_SOLICITADA_COMPANY:
			'border-fuchsia-500/35 bg-fuchsia-500/10 text-fuchsia-950 dark:text-fuchsia-100',
		ESTUDIO_ENVIADO_CLIENTE:
			'border-violet-500/35 bg-violet-500/10 text-violet-950 dark:text-violet-100',
		EJECUTIVO_COMERCIAL_ASIGNADO:
			'border-cyan-500/35 bg-cyan-500/10 text-cyan-950 dark:text-cyan-100',
		OPORTUNIDAD_CREADA:
			'border-slate-500/35 bg-slate-500/10 text-slate-900 dark:text-slate-100',
		PROPUESTA_ACEPTADA:
			'border-teal-500/35 bg-teal-500/10 text-teal-950 dark:text-teal-100',
		POLIZA_REGISTRADA:
			'border-emerald-500/45 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100',
		PLAN_PAGO_CREADO:
			'border-emerald-500/45 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100',
	}
