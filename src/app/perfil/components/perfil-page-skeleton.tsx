import { Skeleton } from '@/components/skeleton'

export function PerfilPageSkeleton() {
	return (
		<div className='mx-auto grid gap-8'>
			<div className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
				<div className='border-b border-border/80 p-4 sm:p-6'>
					<div className='flex items-center gap-3'>
						<Skeleton className='h-9 w-9 rounded-full' />
						<div className='space-y-1.5'>
							<Skeleton className='h-4 w-48' />
							<Skeleton className='h-3 w-32' />
						</div>
					</div>
				</div>

				<div className='space-y-4 p-4 sm:p-6'>
					<div className='rounded-lg border border-border p-4'>
						<Skeleton className='h-4 w-32' />
						<div className='mt-3 grid gap-3 sm:grid-cols-2'>
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className='space-y-1.5'>
									<Skeleton className='h-3 w-20' />
									<Skeleton className='h-9 w-full rounded-md' />
								</div>
							))}
						</div>
					</div>

					<div className='rounded-lg border border-border p-4'>
						<Skeleton className='h-4 w-40' />
						<div className='mt-3 space-y-3'>
							<Skeleton className='h-9 w-full rounded-md' />
							<Skeleton className='h-9 w-full rounded-md' />
							<Skeleton className='h-9 w-32 rounded-md' />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
