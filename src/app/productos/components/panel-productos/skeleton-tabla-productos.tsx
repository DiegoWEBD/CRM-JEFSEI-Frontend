import { Skeleton } from '@/components/skeleton'

type SkeletonFilasProps = {
	cantidad?: number
}

function SkeletonFilaProducto() {
	return (
		<tr className='border-b border-border/50 last:border-b-0'>
			<td className='px-4 py-2.5'>
				<Skeleton className='h-4 w-40' />
			</td>
			<td className='px-4 py-2.5'>
				<Skeleton className='h-5 w-24' />
			</td>
			<td className='px-4 py-2.5'>
				<div className='flex items-center justify-end gap-1'>
					<Skeleton className='size-8 rounded-md' />
					<Skeleton className='size-8 rounded-md' />
				</div>
			</td>
		</tr>
	)
}

/**
 * Filas skeleton para el <tbody> de la tabla desktop. Se renderizan dentro
 * del shell real de la tabla (headers y paginación visibles) mientras carga.
 */
export function SkeletonFilasTablaProductos({
	cantidad = 5,
}: SkeletonFilasProps) {
	return (
		<>
			{Array.from({ length: cantidad }).map((_, i) => (
				<SkeletonFilaProducto key={i} />
			))}
		</>
	)
}

function SkeletonCardProducto() {
	return (
		<div className='rounded-lg border border-border bg-card p-4'>
			<div className='flex items-start justify-between gap-2'>
				<div className='min-w-0 flex-1 space-y-1.5'>
					<Skeleton className='h-4 w-40' />
					<Skeleton className='h-5 w-24' />
				</div>
				<div className='flex gap-1'>
					<Skeleton className='size-8 rounded-md' />
					<Skeleton className='size-8 rounded-md' />
				</div>
			</div>
		</div>
	)
}

/** Cards skeleton para el listado mobile. */
export function SkeletonCardsProductos({ cantidad = 5 }: SkeletonFilasProps) {
	return (
		<>
			{Array.from({ length: cantidad }).map((_, i) => (
				<SkeletonCardProducto key={i} />
			))}
		</>
	)
}
