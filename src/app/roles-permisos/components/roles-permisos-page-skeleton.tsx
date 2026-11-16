import { Skeleton } from '@/components/skeleton'

export function RolesPermisosPageSkeleton() {
	return (
		<section className='overflow-hidden rounded-lg border border-border bg-card shadow-none'>
			<div className='border-b border-border/80 p-3 sm:p-4'>
				<div className='flex flex-wrap gap-2'>
					<Skeleton className='h-9 w-48 rounded-md' />
					<Skeleton className='h-9 w-40 rounded-md' />
				</div>
			</div>

			<div className='p-3 sm:p-4'>
				<div className='grid gap-4 lg:grid-cols-[15rem_1fr]'>
					<div className='space-y-1.5'>
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className='h-10 w-full rounded-md' />
						))}
					</div>
					<div className='space-y-3'>
						<Skeleton className='h-9 w-full rounded-md' />
						{Array.from({ length: 8 }).map((_, i) => (
							<Skeleton key={i} className='h-12 w-full rounded-md' />
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
