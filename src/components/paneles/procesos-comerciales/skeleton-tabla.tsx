import { Skeleton } from '@/components/skeleton'

export function SkeletonTabla() {
	return (
		<>
			{/* Mobile skeleton */}
			<div className='space-y-3 lg:hidden'>
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className='rounded-lg border border-border bg-card p-4'>
						<div className='flex items-start justify-between gap-2'>
							<div className='flex items-center gap-2 min-w-0'>
								<Skeleton className='h-3 w-3 shrink-0 rounded-full' />
								<div className='space-y-1.5'>
									<Skeleton className='h-4 w-32' />
									<Skeleton className='h-3 w-24' />
								</div>
							</div>
							<Skeleton className='h-5 w-16 rounded-full' />
						</div>
						<div className='mt-2 grid grid-cols-2 gap-x-3 gap-y-1'>
							<Skeleton className='h-3 w-20' />
							<Skeleton className='h-5 w-20 rounded-full' />
							<Skeleton className='h-3 w-24' />
							<Skeleton className='h-3 w-16' />
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
								<th className='px-4 py-2.5'><Skeleton className='h-3 w-14' /></th>
								<th className='px-4 py-2.5'><Skeleton className='h-3 w-16' /></th>
								<th className='px-4 py-2.5'><Skeleton className='h-3 w-12' /></th>
								<th className='px-4 py-2.5'><Skeleton className='h-3 w-14' /></th>
								<th className='px-4 py-2.5'><Skeleton className='h-3 w-8 ml-auto' /></th>
								<th className='px-4 py-2.5'><Skeleton className='h-3 w-16 mx-auto' /></th>
							</tr>
						</thead>
						<tbody>
							{Array.from({ length: 5 }).map((_, i) => (
								<tr key={i} className='border-b border-border/50 last:border-b-0'>
									<td className='px-4 py-2.5'>
										<Skeleton className='h-4 w-32 mb-1' />
										<Skeleton className='h-3 w-24' />
									</td>
									<td className='px-4 py-2.5'><Skeleton className='h-3 w-24' /></td>
									<td className='px-4 py-2.5'><Skeleton className='h-3 w-20' /></td>
									<td className='px-4 py-2.5'><Skeleton className='h-5 w-20 rounded-full' /></td>
									<td className='px-4 py-2.5'><Skeleton className='h-3 w-10 ml-auto' /></td>
									<td className='px-4 py-2.5'><Skeleton className='h-3 w-16 mx-auto' /></td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}
