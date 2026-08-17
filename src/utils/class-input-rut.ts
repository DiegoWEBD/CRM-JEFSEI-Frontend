import { cn } from '@/lib/utils'
import type { EstadoValidacionRutChileno } from './validar-rut'

export function classInputRut(estado: EstadoValidacionRutChileno): string {
	return cn(
		'h-9 text-sm shadow-none',
		estado === 'incompleto' &&
			'border-warning/60 bg-warning/[0.06] dark:bg-warning/10',
		(estado === 'formato_invalido' || estado === 'dv_invalido') &&
			'border-destructive/60 bg-destructive/[0.07] dark:border-destructive/55 dark:bg-destructive/15',
	)
}
