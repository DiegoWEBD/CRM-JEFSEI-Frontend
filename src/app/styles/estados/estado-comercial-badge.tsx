import { EstadoComercialProspecto } from '@/app/types/estados/estado-comercial-cliente'

export const ESTADO_COMERCIAL_BADGE: Record<EstadoComercialProspecto, string> =
	{
		nuevo:
			'border-slate-500/35 bg-slate-500/10 text-slate-900 dark:text-slate-100',
		contactado:
			'border-sky-500/35 bg-sky-500/10 text-sky-950 dark:text-sky-100',
		cotizacion_solicitada_compania:
			'border-indigo-500/35 bg-indigo-500/10 text-indigo-950 dark:text-indigo-100',
		estudio_disponible:
			'border-blue-600/35 bg-blue-600/10 text-blue-950 dark:text-blue-100',
		estudio_enviado_cliente:
			'border-violet-500/35 bg-violet-500/10 text-violet-950 dark:text-violet-100',
		recotizacion_solicitada:
			'border-amber-500/45 bg-amber-500/10 text-amber-950 dark:text-amber-100',
		cerrado_ganado:
			'border-emerald-700/45 bg-emerald-700/15 text-emerald-950 dark:text-emerald-100',
		cerrado_perdido: 'border-border bg-muted/50 text-muted-foreground',
	}
