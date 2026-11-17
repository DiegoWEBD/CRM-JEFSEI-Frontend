import { Skeleton } from '@/components/skeleton'
import { cn } from '@/lib/utils'

/**
 * Skeleton del área de valores de una tarjeta de métrica. Ocupa solo el
 * bloque donde se representan los valores: el título de la tarjeta se
 * mantiene visible durante la carga.
 */
export function MetricaContenidoSkeleton({
	className,
	alto = 64,
	lineas = 2,
}: {
	className?: string
	/** Alto aproximado del bloque de valores (px) */
	alto?: number
	/** Cantidad de líneas secundarias bajo la barra principal */
	lineas?: number
}) {
	return (
		<div className={cn('space-y-2', className)} style={{ minHeight: alto }}>
			<Skeleton className='h-7 w-40' />
			{Array.from({ length: lineas }).map((_, i) => (
				<Skeleton key={i} className='h-3 w-24' />
			))}
		</div>
	)
}

/**
 * Skeleton del área de un gráfico: bloque del alto del área de
 * visualización, dejando el título del gráfico visible durante la carga.
 */
export function MetricaGraficoSkeleton({
	className,
	alto = 220,
}: {
	className?: string
	/** Alto del área del gráfico (px) */
	alto?: number
}) {
	return (
		<div className={cn('w-full', className)} style={{ minHeight: alto }}>
			<Skeleton className='h-full min-h-[inherit] w-full rounded-lg' />
		</div>
	)
}

/**
 * Mensaje de error para el área de valores de una tarjeta de métrica: el
 * título de la tarjeta se mantiene visible.
 */
export function MetricaContenidoError({ className }: { className?: string }) {
	return (
		<p
			className={cn(
				'py-6 text-center text-xs text-muted-foreground',
				className,
			)}
		>
			Error al cargar la métrica.
		</p>
	)
}
