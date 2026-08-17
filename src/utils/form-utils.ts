import { cn } from '@/lib/utils'

export function inp(pendiente: boolean, extra?: string) {
	return cn(
		'h-9 text-sm shadow-none',
		pendiente && 'border-warning/60 bg-warning/[0.06] dark:bg-warning/10',
		extra,
	)
}

export function classPendienteLabel(pendiente: boolean) {
	return pendiente ? 'text-warning' : undefined
}
