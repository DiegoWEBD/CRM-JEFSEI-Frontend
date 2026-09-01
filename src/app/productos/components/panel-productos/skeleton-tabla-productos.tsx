import { Skeleton } from '@/components/skeleton'

export function SkeletonTablaProductos() {
	return (
		<>
			{/* Mobile skeleton */}
			<div className='space-y-3 lg:hidden'>
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className='rounded-lg border border-border bg-card p-4'>
						<div className='flex items-start justify-between gap-2'>
							<div className='min-w-0 flex-1 space-y-1.5'>
								<Skeleton className='h-4 w-40' />
								<Skeleton className='h-3 w-28' />
							</div>
							<div className='flex gap-1'>
								<Skeleton className='size-8 rounded-md' />
								<Skeleton className='size-8 rounded-md' />
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Desktop skeleton */}
			<div className='hidden lg:block'>
				<div className='overflow-x-auto rounded-lg border border-border'>
					<table className='w-full'>
						<thead>
							<tr className='border-b border-border bg-muted/40'>
								<th className='px-4 py-2.5'>
									<Skeleton className='h-3 w-16' />
								</th>
								<th className='px-4 py-2.5'>
									<Skeleton className='h-3 w-24' />
								</th>
								<th className='px-4 py-2.5'>
									<Skeleton className='h-3 w-16 ml-auto' />
								</th>
							</tr>
						</thead>
						<tbody>
							{Array.from({ length: 5 }).map((_, i) => (
								<tr
									key={i}
									className='border-b border-border/50 last:border-b-0'
								>
									<td className='px-4 py-2.5'>
										<Skeleton className='h-4 w-40' />
									</td>
									<td className='px-4 py-2.5'>
										<Skeleton className='h-3 w-28' />
									</td>
									<td className='px-4 py-2.5'>
										<div className='flex justify-end gap-1'>
											<Skeleton className='size-8 rounded-md' />
											<Skeleton className='size-8 rounded-md' />
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}
