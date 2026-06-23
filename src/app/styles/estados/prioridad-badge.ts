import { Prioridad } from '@/types/prioridad/prioridad'

export const PRIORIDAD_BADGE: Record<Prioridad, string> = {
	normal:
		'border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100',
	alta: 'border-red-500/40 bg-red-500/10 text-red-900 dark:text-red-100',
}
