import { Skeleton } from '@/components/skeleton'

type SkeletonItemsProps = {
	cantidad?: number
}

function SkeletonFilaCotizacion() {
	return (
		<tr className='border-b border-border/60'>
			<td className='px-3 py-2.5'>
				<Skeleton className='h-4 w-40' />
			</td>
			<td className='px-3 py-2.5'>
				<Skeleton className='h-4 w-32' />
			</td>
			<td className='px-3 py-2.5'>
				<Skeleton className='h-4 w-28' />
			</td>
			<td className='px-3 py-2.5'>
				<Skeleton className='h-10 w-44 rounded-md' />
			</td>
			<td className='px-3 py-2.5'>
				<Skeleton className='h-5 w-20 rounded-full' />
			</td>
			<td className='px-3 py-2.5'>
				<Skeleton className='h-5 w-16 rounded-full' />
			</td>
			<td className='px-3 py-2.5'>
				<Skeleton className='ml-auto h-8 w-32 rounded-md' />
			</td>
		</tr>
	)
}

/**
 * Filas skeleton para el <tbody> de la tabla desktop. Se renderizan dentro del
 * shell real de la tabla (headers y paginación visibles) mientras se hace un
 * fetch client-side (filtrar, buscar, paginar).
 */
export function SkeletonFilasTablaCotizaciones({
	cantidad = 10,
}: SkeletonItemsProps) {
	return (
		<>
			{Array.from({ length: cantidad }).map((_, i) => (
				<SkeletonFilaCotizacion key={i} />
			))}
		</>
	)
}

function SkeletonCardCotizacion() {
	return (
		<div className='space-y-3 rounded-lg border border-border bg-card p-4'>
			<div className='flex items-start justify-between gap-2'>
				<div className='min-w-0 flex-1 space-y-1.5'>
					<Skeleton className='h-4 w-40' />
					<Skeleton className='h-3 w-28' />
				</div>
				<Skeleton className='h-4 w-4' />
			</div>
			<div className='flex flex-wrap items-center gap-2'>
				<Skeleton className='h-5 w-20 rounded-full' />
				<Skeleton className='h-5 w-12 rounded-full' />
			</div>
			<div className='flex items-center justify-between'>
				<Skeleton className='h-3 w-32' />
				<Skeleton className='h-3 w-24' />
			</div>
		</div>
	)
}

/**
 * Cards skeleton para el layout mobile: se renderizan mientras se hace un
 * fetch client-side.
 */
export function SkeletonCardsCotizaciones({
	cantidad = 10,
}: SkeletonItemsProps) {
	return (
		<div className='space-y-3 lg:hidden'>
			{Array.from({ length: cantidad }).map((_, i) => (
				<SkeletonCardCotizacion key={i} />
			))}
		</div>
	)
}
