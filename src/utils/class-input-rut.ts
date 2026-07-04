import { cn } from '@/lib/utils'
import type { EstadoValidacionRutChileno } from './validar-rut'

export function classInputRut(estado: EstadoValidacionRutChileno): string {
	return cn(
		'h-9 text-sm shadow-none',
		estado === 'incompleto' &&
			'border-amber-500/60 bg-amber-500/[0.06] dark:border-amber-500/50 dark:bg-amber-950/25',
		(estado === 'formato_invalido' || estado === 'dv_invalido') &&
			'border-destructive/60 bg-destructive/[0.07] dark:border-destructive/55 dark:bg-destructive/15',
	)
}
