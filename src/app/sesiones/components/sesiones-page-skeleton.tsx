import { Skeleton } from '@/components/skeleton'

export function SesionesPageSkeleton() {
	return (
		<section className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
			<div className='border-b border-border/80 p-3 sm:p-4'>
				<div className='flex flex-wrap gap-2'>
					<Skeleton className='h-9 w-40 rounded-md' />
					<Skeleton className='h-9 w-40 rounded-md' />
					<Skeleton className='h-9 w-32 rounded-md' />
				</div>
				<div className='mt-3 flex flex-wrap items-center gap-2'>
					<Skeleton className='h-9 min-w-[12rem] flex-1 rounded-md' />
					<Skeleton className='h-9 w-40 rounded-md' />
					<Skeleton className='h-9 w-36 rounded-md' />
				</div>
				<Skeleton className='mt-3 h-3 w-48' />
			</div>

			<div className='p-3 sm:p-4'>
				{/* Mobile skeleton */}
				<div className='space-y-3 lg:hidden'>
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							key={i}
							className='rounded-lg border border-border bg-card p-4'
						>
							<div className='space-y-1.5'>
								<Skeleton className='h-4 w-40' />
								<Skeleton className='h-3 w-28' />
								<Skeleton className='h-3 w-32' />
								<Skeleton className='h-3 w-24' />
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
									{Array.from({ length: 7 }).map((_, i) => (
										<th key={i} className='px-4 py-2.5'>
											<Skeleton className='h-3 w-16' />
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{Array.from({ length: 8 }).map((_, i) => (
									<tr
										key={i}
										className='border-b border-border/50 last:border-b-0'
									>
										{Array.from({ length: 7 }).map((_, j) => (
											<td key={j} className='px-4 py-2.5'>
												<Skeleton className='h-3 w-24' />
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</section>
	)
}