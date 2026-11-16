import { Skeleton } from '@/components/skeleton'
import { cn } from '@/lib/utils'

/**
 * Skeleton genérico para las tarjetas de métricas del dashboard mientras
 * la query del cliente resuelve.
 */
export function MetricaCardSkeleton({
	className,
	alto = 96,
}: {
	className?: string
	/** Alto aproximado del bloque de contenido (px) */
	alto?: number
}) {
	return (
		<div
			className={cn(
				'rounded-lg border border-border bg-card p-3.5 shadow-none',
				className,
			)}
		>
			<Skeleton className='h-3 w-32' />
			<div className='mt-2.5 space-y-2' style={{ minHeight: alto }}>
				<Skeleton className='h-7 w-40' />
				<Skeleton className='h-3 w-24' />
			</div>
		</div>
	)
}

export function MetricaCardError({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				'rounded-lg border border-border bg-card p-3.5 shadow-none',
				className,
			)}
		>
			<p className='py-6 text-center text-xs text-muted-foreground'>
				Error al cargar la métrica.
			</p>
		</div>
	)
}
